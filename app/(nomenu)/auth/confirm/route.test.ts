import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

const supabase = {
  auth: { verifyOtp: vi.fn(), signOut: vi.fn() },
  rpc: vi.fn(),
};

vi.mock("@/lib/supabase/server", () => ({ createClient: async () => supabase }));

const ORIGIN = "http://localhost:3000";

function confirm(query: string) {
  return GET(new Request(`${ORIGIN}/auth/confirm${query}`));
}

describe("GET /auth/confirm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("redirects to /error without token", async () => {
    const res = await confirm("");
    expect(res.headers.get("location")).toBe(`${ORIGIN}/error`);
    expect(supabase.auth.verifyOtp).not.toHaveBeenCalled();
  });

  it("redirects to the login page when the link has expired", async () => {
    supabase.auth.verifyOtp.mockResolvedValue({
      data: { user: null, session: null },
      error: { code: "otp_expired", message: "Email link is invalid or has expired" },
    });
    const res = await confirm("?token_hash=abc&type=invite");
    expect(res.headers.get("location")).toBe(`${ORIGIN}/auth/login?error=expired`);
  });

  it("redirects to /error on any other error", async () => {
    supabase.auth.verifyOtp.mockResolvedValue({
      data: { user: null, session: null },
      error: { code: "unexpected_failure", message: "boom" },
    });
    const res = await confirm("?token_hash=abc&type=magiclink");
    expect(res.headers.get("location")).toBe(`${ORIGIN}/error`);
  });

  it("signs in an active member", async () => {
    supabase.auth.verifyOtp.mockResolvedValue({ data: { user: { id: "u1" }, session: {} }, error: null });
    supabase.rpc.mockResolvedValue({ data: true });
    const res = await confirm("?token_hash=abc&type=invite");
    expect(res.headers.get("location")).toBe(`${ORIGIN}/`);
    expect(supabase.auth.signOut).not.toHaveBeenCalled();
  });

  it("signs out an inactive member", async () => {
    supabase.auth.verifyOtp.mockResolvedValue({ data: { user: { id: "u1" }, session: {} }, error: null });
    supabase.rpc.mockResolvedValue({ data: false });
    const res = await confirm("?token_hash=abc&type=magiclink");
    expect(res.headers.get("location")).toBe(`${ORIGIN}/auth/login?error=membership`);
    expect(supabase.auth.signOut).toHaveBeenCalled();
  });
});
