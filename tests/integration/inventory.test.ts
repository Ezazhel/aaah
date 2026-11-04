import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { admin, createUser, deleteUsers, type TestUser } from "./helpers";

// Inventory: places, stock, loans (request -> approve -> borrowed -> returned, direct take).
describe("inventory", () => {
  let bar: TestUser;
  let otherManager: TestUser;
  let author: TestUser;
  let expiredAuthor: TestUser;
  let locationId: string;
  let itemId: string;

  const stock = async () => {
    const { data } = await admin.from("inventory_stock").select("quantity, reserved, available")
      .eq("location_id", locationId).eq("item_id", itemId).single();
    return data;
  };

  beforeAll(async () => {
    [bar, otherManager, author, expiredAuthor] = await Promise.all([
      createUser("bar", ["location_manager"], { expired: true, names: false }),
      createUser("manager", ["location_manager"]),
      createUser("borrower", ["author"]),
      createUser("expired", ["author"], { expired: true }),
    ]);
  });

  afterAll(async () => {
    if (locationId) {
      await admin.from("inventory_loans").delete().eq("location_id", locationId);
      await admin.from("inventory_locations").delete().eq("id", locationId);
    }
    if (itemId) await admin.from("inventory_items").delete().eq("id", itemId);
    await deleteUsers([bar, otherManager, author, expiredAuthor]);
  });

  it("lets a stock manager create a place they manage", async () => {
    const { data, error } = await bar.client.from("inventory_locations")
      .insert({ name: "Bar test", manager_id: bar.id }).select("id, manager_id").single();
    expect(error).toBeNull();
    expect(data!.manager_id).toBe(bar.id);
    locationId = data!.id;
  });

  it("does not let an author create a place, nor a manager create one for someone else", async () => {
    const author_ = await author.client.from("inventory_locations").insert({ name: "Nope", manager_id: author.id });
    expect(author_.error?.code).toBe("42501");

    const forOther = await bar.client.from("inventory_locations").insert({ name: "Nope", manager_id: otherManager.id });
    expect(forOther.error?.code).toBe("42501");
  });

  it("does not let the manager hand the place to someone else", async () => {
    const { error } = await bar.client.from("inventory_locations").update({ manager_id: otherManager.id }).eq("id", locationId);
    expect(error?.code).toBe("42501");
  });

  it("lets the manager add an item and set its stock, with a movement", async () => {
    const { data, error } = await bar.client.from("inventory_items")
      .insert({ name: `Dés test ${Date.now()}`, category: "Dés", created_by: bar.id }).select("id").single();
    expect(error).toBeNull();
    itemId = data!.id;

    expect((await bar.client.rpc("inventory_set_stock", { p_location: locationId, p_item: itemId, p_quantity: 5 })).error).toBeNull();
    expect(await stock()).toEqual({ quantity: 5, reserved: 0, available: 5 });

    const { data: movements } = await bar.client.from("inventory_movements").select("delta, reason").eq("location_id", locationId);
    expect(movements).toEqual([{ delta: 5, reason: "adjustment" }]);
  });

  it("does not let another manager change this stock", async () => {
    const { error } = await otherManager.client.rpc("inventory_set_stock", { p_location: locationId, p_item: itemId, p_quantity: 99 });
    expect(error?.code).toBe("42501");
  });

  it("refuses a request above the available quantity, or from an expired author", async () => {
    const tooMany = await author.client.rpc("inventory_request_loan", { p_item: itemId, p_location: locationId, p_quantity: 6 });
    expect(tooMany.error?.message).toContain("not_enough_stock");

    const expired = await expiredAuthor.client.rpc("inventory_request_loan", { p_item: itemId, p_location: locationId, p_quantity: 1 });
    expect(expired.error?.code).toBe("42501");
  });

  it("runs a request: approve (reserved) -> borrowed -> returned", async () => {
    const { data: loanId, error } = await author.client.rpc("inventory_request_loan", { p_item: itemId, p_location: locationId, p_quantity: 2, p_message: "Pour un proto" });
    expect(error).toBeNull();

    // Only the managers of the place decide.
    const notManager = await otherManager.client.rpc("inventory_decide_loan", { p_loan: loanId!, p_approve: true });
    expect(notManager.error?.code).toBe("42501");

    expect((await bar.client.rpc("inventory_decide_loan", { p_loan: loanId!, p_approve: true, p_note: "Passe jeudi" })).error).toBeNull();
    expect(await stock()).toEqual({ quantity: 5, reserved: 2, available: 3 });

    // The reserved quantity cannot be removed from the stock.
    const below = await bar.client.rpc("inventory_set_stock", { p_location: locationId, p_item: itemId, p_quantity: 1 });
    expect(below.error?.message).toContain("reserved_above_quantity");

    expect((await bar.client.rpc("inventory_mark_borrowed", { p_loan: loanId! })).error).toBeNull();
    expect(await stock()).toEqual({ quantity: 3, reserved: 0, available: 3 });

    expect((await bar.client.rpc("inventory_mark_returned", { p_loan: loanId! })).error).toBeNull();
    expect(await stock()).toEqual({ quantity: 5, reserved: 0, available: 5 });

    const { data: loan } = await author.client.from("inventory_loans").select("status, decision_note").eq("id", loanId!).single();
    expect(loan).toEqual({ status: "returned", decision_note: "Passe jeudi" });

    // Same step twice: refused.
    const again = await bar.client.rpc("inventory_mark_returned", { p_loan: loanId! });
    expect(again.error?.message).toContain("invalid_status");
  });

  it("records a direct take and lets the borrower cancel an approved request", async () => {
    const { data: takeId, error } = await author.client.rpc("inventory_declare_borrow", { p_item: itemId, p_location: locationId, p_quantity: 1 });
    expect(error).toBeNull();
    expect(await stock()).toEqual({ quantity: 4, reserved: 0, available: 4 });

    const { data: requestId } = await author.client.rpc("inventory_request_loan", { p_item: itemId, p_location: locationId, p_quantity: 4 });
    await bar.client.rpc("inventory_decide_loan", { p_loan: requestId!, p_approve: true });
    expect(await stock()).toEqual({ quantity: 4, reserved: 4, available: 0 });

    expect((await author.client.rpc("inventory_cancel_loan", { p_loan: requestId! })).error).toBeNull();
    expect(await stock()).toEqual({ quantity: 4, reserved: 0, available: 4 });

    // A borrowed loan cannot be cancelled by the borrower.
    const cancelTake = await author.client.rpc("inventory_cancel_loan", { p_loan: takeId! });
    expect(cancelTake.error?.message).toContain("invalid_status");
  });

  it("hides loans from other members and gives the notification emails to the service role only", async () => {
    const { data: visible } = await otherManager.client.from("inventory_loans").select("id").eq("location_id", locationId);
    expect(visible).toEqual([]);

    const { data: loans } = await admin.from("inventory_loans").select("id").eq("location_id", locationId).limit(1);
    const loanId = loans![0].id;
    const asUser = await author.client.rpc("inventory_notify_targets", { p_loan: loanId });
    expect(asUser.error).not.toBeNull();

    const { data: targets } = await admin.rpc("inventory_notify_targets", { p_loan: loanId });
    expect(targets).toEqual(expect.arrayContaining([
      { target: "manager", email: bar.email },
      { target: "borrower", email: author.email },
    ]));
  });
});
