import { beforeEach, describe, expect, it, vi } from "vitest";
import { confirmLink } from "./confirm";

const supabase = {
  auth: { verifyOtp: vi.fn(), signOut: vi.fn() },
  rpc: vi.fn(),
};

vi.mock("@/lib/supabase/server", () => ({ createClient: async () => supabase }));
// Like Next.js, redirect() interrupts the action.
vi.mock("next/navigation", () => ({
  redirect: (url: string) => { throw new Redirect(url); },
}));

class Redirect extends Error {
  constructor(readonly url: string) { super(url); }
}

async function confirm(fields: Record<string, string>) {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => formData.set(key, value));
  try {
    await confirmLink(formData);
  } catch (error) {
    if (error instanceof Redirect) return error.url;
    throw error;
  }
  throw new Error("confirmLink did not redirect");
}

describe("confirmLink", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("redirects to /error without token", async () => {
    expect(await confirm({ type: "invite" })).toBe("/error");
    expect(supabase.auth.verifyOtp).not.toHaveBeenCalled();
  });

  it("redirects to /error with an unknown type", async () => {
    expect(await confirm({ token_hash: "abc", type: "phone_change" })).toBe("/error");
    expect(supabase.auth.verifyOtp).not.toHaveBeenCalled();
  });

  it("redirects to the login page when the link has expired", async () => {
    supabase.auth.verifyOtp.mockResolvedValue({
      data: { user: null, session: null },
      error: { code: "otp_expired", message: "Email link is invalid or has expired" },
    });
    expect(await confirm({ token_hash: "abc", type: "invite" })).toBe("/auth/login?error=expired");
  });

  it("redirects to /error on any other error", async () => {
    supabase.auth.verifyOtp.mockResolvedValue({
      data: { user: null, session: null },
      error: { code: "unexpected_failure", message: "boom" },
    });
    expect(await confirm({ token_hash: "abc", type: "email" })).toBe("/error");
  });

  it("signs in an active member", async () => {
    supabase.auth.verifyOtp.mockResolvedValue({ data: { user: { id: "u1" }, session: {} }, error: null });
    supabase.rpc.mockResolvedValue({ data: true });
    expect(await confirm({ token_hash: "abc", type: "invite" })).toBe("/");
    expect(supabase.auth.verifyOtp).toHaveBeenCalledWith({ token_hash: "abc", type: "invite" });
    expect(supabase.auth.signOut).not.toHaveBeenCalled();
  });

  it("signs out an inactive member", async () => {
    supabase.auth.verifyOtp.mockResolvedValue({ data: { user: { id: "u1" }, session: {} }, error: null });
    supabase.rpc.mockResolvedValue({ data: false });
    expect(await confirm({ token_hash: "abc", type: "email" })).toBe("/auth/login?error=membership");
    expect(supabase.auth.signOut).toHaveBeenCalled();
  });
});
