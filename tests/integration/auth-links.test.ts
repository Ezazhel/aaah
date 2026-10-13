import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createClient } from "@supabase/supabase-js";

// Checks the Supabase behavior the expired-link flow relies on, against the local stack.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const MAILPIT = process.env.MAILPIT_URL ?? "http://127.0.0.1:54324";

if (!/^http:\/\/(127\.0\.0\.1|localhost)[:/]/.test(url ?? "")) {
  throw new Error(`Integration tests only run against a local Supabase (got ${url}).`);
}

const options = { auth: { persistSession: false, autoRefreshToken: false } };
const admin = createClient(url, process.env.SUPABASE_SECRET_KEY!, options);
const anon = () => createClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, options);

const email = `invite-${Date.now()}@test.local`;
let userId: string | undefined;

async function lastMailTo(to: string) {
  for (let i = 0; i < 20; i++) {
    const res = await fetch(`${MAILPIT}/api/v1/search?query=${encodeURIComponent(`to:"${to}"`)}`);
    const { messages } = await res.json();
    if (messages?.length) {
      const msg = await fetch(`${MAILPIT}/api/v1/message/${messages[0].ID}`).then((r) => r.json());
      return msg as { Subject: string; HTML: string };
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`No email received by ${to}`);
}

describe("invitation links", () => {
  let inviteTokenHash: string;

  beforeAll(async () => {
    const { data, error } = await admin.auth.admin.generateLink({ type: "invite", email });
    if (error) throw error;
    userId = data.user.id;
    inviteTokenHash = data.properties.hashed_token;
  });

  afterAll(async () => {
    if (userId) await admin.auth.admin.deleteUser(userId);
  });

  it("returns otp_expired for an already used invitation link", async () => {
    const first = await anon().auth.verifyOtp({ token_hash: inviteTokenHash, type: "invite" });
    expect(first.error).toBeNull();

    const second = await anon().auth.verifyOtp({ token_hash: inviteTokenHash, type: "invite" });
    expect(second.error?.code).toBe("otp_expired");
  });

  it("returns otp_expired for an unknown token", async () => {
    const { error } = await anon().auth.verifyOtp({ token_hash: "0".repeat(56), type: "magiclink" });
    expect(error?.code).toBe("otp_expired");
  });
});

describe("invited user who never clicked the link", () => {
  const pendingEmail = `pending-${Date.now()}@test.local`;
  let pendingId: string | undefined;

  beforeAll(async () => {
    const { data, error } = await admin.auth.admin.generateLink({ type: "invite", email: pendingEmail });
    if (error) throw error;
    pendingId = data.user.id;
  });

  afterAll(async () => {
    if (pendingId) await admin.auth.admin.deleteUser(pendingId);
  });

  it("can request a new link from the login page", async () => {
    // Same call as signInWithMagicLink (app/(nomenu)/auth/login/actions/auth.ts).
    const { error } = await anon().auth.signInWithOtp({
      email: pendingEmail,
      options: { shouldCreateUser: false },
    });
    expect(error).toBeNull();

    const mail = await lastMailTo(pendingEmail);
    const tokenHash = mail.HTML.match(/token_hash=([0-9a-f]+)&amp;type=(\w+)|token_hash=([0-9a-f]+)&type=(\w+)/);
    expect(tokenHash).not.toBeNull();
    const [hash, type] = tokenHash![1] ? [tokenHash![1], tokenHash![2]] : [tokenHash![3], tokenHash![4]];

    const { data, error: verifyError } = await anon().auth.verifyOtp({ token_hash: hash, type: type as "magiclink" });
    expect(verifyError).toBeNull();
    expect(data.user?.id).toBe(pendingId);
  });
});
