import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";

// node:crypto is needed for timingSafeEqual.
export const runtime = "nodejs";

// Only the fields used below (HelloAsso API v5, GET /v5/orders/{id}).
type HelloAssoOrder = {
  organizationSlug?: string;
  formSlug?: string;
  formType?: string;
  amount?: { total?: number };
  payments?: { state?: string }[];
  payer?: { email?: string; firstName?: string; lastName?: string };
  items?: { customFields?: { name?: string; answer?: string }[] }[];
};

type HelloAssoNotification = {
  eventType?: string;
  data?: { id?: number; formType?: string };
};

// https://api.helloasso.com in production, https://api.helloasso-sandbox.com for tests.
const HA_API = process.env.HELLOASSO_API_URL ?? "https://api.helloasso.com";

// HelloAsso does not sign its webhooks: a long random secret is put in the URL
// declared on HelloAsso (…/api/helloasso/webhook?secret=XXXX) and checked here.
function hasValidSecret(req: Request): boolean {
  const received = new URL(req.url).searchParams.get("secret") ?? "";
  const expected = process.env.HELLOASSO_WEBHOOK_SECRET ?? "";
  if (!expected || received.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(received), Buffer.from(expected));
}

// The order must be a membership to one of our forms, and paid.
function isLegitMembership(order: HelloAssoOrder): boolean {
  if (order.organizationSlug !== process.env.HELLOASSO_ORG_SLUG) return false;
  if (order.formType !== "Membership") return false;

  const allowedForms = (process.env.HELLOASSO_FORM_SLUGS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  if (allowedForms.length && !allowedForms.includes(order.formSlug ?? "")) return false;

  // Paid membership: at least one authorized payment.
  // ALLOW_FREE_MEMBERSHIP=true only if the form offers a free membership.
  const total = order.amount?.total ?? 0;
  if (total === 0) return process.env.ALLOW_FREE_MEMBERSHIP === "true";
  return (order.payments ?? []).some((p) => p.state === "Authorized");
}

async function getHelloAssoToken(): Promise<string> {
  const res = await fetch(`${HA_API}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.HELLOASSO_CLIENT_ID!,
      client_secret: process.env.HELLOASSO_CLIENT_SECRET!,
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Token HelloAsso refusé (${res.status})`);
  const json = await res.json();
  return json.access_token;
}

// The webhook body is never trusted: the order is read again from the API.
async function fetchOrder(orderId: number): Promise<HelloAssoOrder> {
  const token = await getHelloAssoToken();
  const res = await fetch(`${HA_API}/v5/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Commande ${orderId} introuvable (${res.status})`);
  return res.json();
}

// A custom field "E-mail de l'adhérent" wins over the payer's email
// (e.g. a parent paying for someone else).
function extractMemberEmail(order: HelloAssoOrder): string | undefined {
  for (const item of order.items ?? []) {
    for (const field of item.customFields ?? []) {
      if (/mail/i.test(field.name ?? "") && field.answer) return field.answer;
    }
  }
  return order.payer?.email;
}

export async function POST(req: Request) {
  if (!hasValidSecret(req)) {
    console.warn("[helloasso] appel refusé : secret absent ou invalide");
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  let body: HelloAssoNotification;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  console.log("[helloasso] notification reçue", body?.eventType, body?.data?.id);

  // Only membership orders are processed; anything else gets a 200 and is ignored.
  const orderId = body?.data?.id;
  if (body?.eventType !== "Order" || body?.data?.formType !== "Membership" || typeof orderId !== "number") {
    return NextResponse.json({ ignored: true });
  }

  const supabase = createAdminClient();

  try {
    const order = await fetchOrder(orderId);

    if (!isLegitMembership(order)) {
      console.warn("[helloasso] commande rejetée (orga, formulaire ou paiement)", orderId);
      return NextResponse.json({ ok: true, skipped: "not-legit" });
    }

    const email = extractMemberEmail(order)?.trim().toLowerCase();
    if (!email) {
      console.warn("[helloasso] aucun e-mail dans la commande", orderId);
      return NextResponse.json({ ok: true, skipped: "no-email" });
    }

    // Idempotency: HelloAsso can send the same notification several times.
    const { error: insertError } = await supabase
      .from("helloasso_orders")
      .insert({ order_id: orderId, email });

    if (insertError?.code === "23505") {
      console.log("[helloasso] commande déjà traitée", orderId);
      return NextResponse.json({ ok: true, duplicate: true });
    }
    if (insertError) throw insertError;

    const { error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email, {
      data: {
        first_name: order.payer?.firstName,
        last_name: order.payer?.lastName,
        helloasso_order_id: orderId,
      },
      redirectTo: `${process.env.NEXT_PUBLIC_URL}/auth/confirm`,
    });

    if (inviteError) {
      // Renewal: the account already exists, not an error.
      if (inviteError.code === "email_exists" || /already been registered/i.test(inviteError.message)) {
        console.log("[helloasso] utilisateur déjà inscrit", email);
      } else {
        throw inviteError;
      }
    } else {
      console.log("[helloasso] invitation envoyée", email);
    }

    // New member or renewal: active until the end of the current period.
    const { data: expiresAt, error: membershipError } = await supabase.rpc("helloasso_grant_membership", {
      p_email: email,
      p_first_name: order.payer?.firstName ?? "",
      p_last_name: order.payer?.lastName ?? "",
    });
    if (membershipError) throw membershipError;
    if (!expiresAt) throw new Error(`Aucun utilisateur pour ${email} après l'invitation`);
    console.log("[helloasso] adhésion active jusqu'au", expiresAt, email);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[helloasso] échec du traitement", orderId, err);
    // Remove the trace so that HelloAsso's retry can process the order again.
    await supabase.from("helloasso_orders").delete().eq("order_id", orderId);
    // A 500 makes HelloAsso send the notification again later.
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
