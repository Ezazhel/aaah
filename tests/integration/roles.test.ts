import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { admin, anon, createUser, deleteUsers, type TestUser } from "./helpers";

// Members + roles: who can sign in, create games, appear in /authors, give or remove roles.
describe("members and roles", () => {
  let author: TestUser;
  let expiredAuthor: TestUser;
  let bar: TestUser;
  let adminUser: TestUser;

  beforeAll(async () => {
    [author, expiredAuthor, bar, adminUser] = await Promise.all([
      createUser("author", ["author"]),
      createUser("expired", ["author"], { expired: true }),
      // A game bar: stock manager, not a member of the association (membership expired).
      createUser("bar", ["location_manager"], { expired: true }),
      createUser("admin", ["admin"]),
    ]);
  });

  afterAll(() => deleteUsers([author, expiredAuthor, bar, adminUser]));

  it("lets active members and stock managers sign in, not expired members", async () => {
    expect((await author.client.rpc("can_sign_in")).data).toBe(true);
    expect((await bar.client.rpc("can_sign_in")).data).toBe(true);
    expect((await adminUser.client.rpc("can_sign_in")).data).toBe(true);
    expect((await expiredAuthor.client.rpc("can_sign_in")).data).toBe(false);
  });

  it("only lets active authors create games", async () => {
    expect((await author.client.rpc("is_active_author")).data).toBe(true);
    expect((await bar.client.rpc("is_active_author")).data).toBe(false);

    const { error } = await bar.client.from("games").insert({ name: `Bar game ${Date.now()}`, created_by: bar.id } as never);
    expect(error?.code).toBe("42501");
  });

  it("lists only authors publicly", async () => {
    const { data, error } = await anon()
      .from("members")
      .select("id, user_roles!inner(role)")
      .eq("user_roles.role", "author")
      .in("id", [author.id, bar.id]);
    expect(error).toBeNull();
    expect(data?.map((row) => row.id)).toEqual([author.id]);
  });

  it("lets admins give and remove author / stock manager roles, never remove admin", async () => {
    const give = await adminUser.client.from("user_roles").insert({ user_id: bar.id, role: "author" });
    expect(give.error).toBeNull();

    const remove = await adminUser.client.from("user_roles").delete({ count: "exact" }).eq("user_id", bar.id).eq("role", "author");
    expect(remove.error).toBeNull();
    expect(remove.count).toBe(1);

    const removeAdmin = await adminUser.client.from("user_roles").delete({ count: "exact" }).eq("user_id", adminUser.id).eq("role", "admin");
    expect(removeAdmin.count).toBe(0);
  });

  it("does not let a non-admin give roles", async () => {
    const { error } = await author.client.from("user_roles").insert({ user_id: author.id, role: "admin" });
    expect(error?.code).toBe("42501");
  });

  it("makes a HelloAsso member an author", async () => {
    await admin.from("user_roles").delete().eq("user_id", bar.id).eq("role", "author");
    const { error } = await admin.rpc("helloasso_grant_membership", { p_email: bar.email, p_first_name: "Bar", p_last_name: "Test" });
    expect(error).toBeNull();
    const { data } = await admin.from("user_roles").select("role").eq("user_id", bar.id);
    expect(data?.map((row) => row.role).sort()).toEqual(["author", "location_manager"]);
  });
});
