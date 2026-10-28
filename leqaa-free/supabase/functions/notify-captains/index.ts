// Supabase Edge Function: sends a phone notification to every captain device.
// Deployed with "Verify JWT" turned OFF. It is protected by a secret header instead (see README).
//
// Secrets to save for this function (Edge Functions > Secrets):
//   VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY   (from tools/make-push-keys.html)
//   VAPID_SUBJECT                         (for example mailto:you@example.com)
//   WEBHOOK_SECRET                        (same text you put in push.sql)
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided automatically.
import webpush from "npm:web-push@3.6.7";

const SB_URL = Deno.env.get("SUPABASE_URL")!;
const SB_KEY = Deno.env.get("SB_SECRET_KEY") ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

webpush.setVapidDetails(
  Deno.env.get("VAPID_SUBJECT") ?? "mailto:admin@example.com",
  Deno.env.get("VAPID_PUBLIC_KEY")!,
  Deno.env.get("VAPID_PRIVATE_KEY")!,
);

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("method not allowed", { status: 405 });
  if (req.headers.get("x-webhook-secret") !== Deno.env.get("WEBHOOK_SECRET")) {
    return new Response("forbidden", { status: 403 });
  }

  const order = await req.json().catch(() => ({}));
  const table = String(order.table_no ?? "?").slice(0, 6);
  const notes = String(order.notes ?? "").trim();
  const payload = JSON.stringify({
    title: `طلب جديد - طاولة ${table}`,
    body: [String(order.summary ?? "").trim(), notes ? `ملاحظات: ${notes}` : "بدون ملاحظات"].filter(Boolean).join("\n").slice(0, 240),
    tag: `order-${String(order.code ?? "")}`,
    url: "/captain/",
  });

  const res = await fetch(`${SB_URL}/rest/v1/push_subscriptions?select=id,endpoint,p256dh,auth`, {
    headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` },
  });
  if (!res.ok) return new Response("could not read subscriptions", { status: 500 });
  const subs: { id: number; endpoint: string; p256dh: string; auth: string }[] = await res.json();

  const dead: number[] = [];
  const errors: string[] = [];
  let sent = 0;
  await Promise.all(subs.map(async (s) => {
    try {
      await webpush.sendNotification(
        { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
        payload,
        { TTL: 1800, urgency: "high" },   // 30 minutes, same as the order lifetime
      );
      sent++;
    } catch (e) {
      const code = (e as { statusCode?: number }).statusCode;
      console.error("push failed", code, String((e as Error).message ?? e), String((e as { body?: string }).body ?? ""));
      errors.push(`${code ?? "?"}: ${String((e as Error).message ?? e).slice(0, 120)}`);
      if (code === 404 || code === 410) dead.push(s.id);   // phone removed the subscription
    }
  }));

  if (dead.length) {
    await fetch(`${SB_URL}/rest/v1/push_subscriptions?id=in.(${dead.join(",")})`, {
      method: "DELETE",
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` },
    });
  }
  return new Response(JSON.stringify({ subscriptions: subs.length, sent, removed: dead.length, errors }), {
    headers: { "Content-Type": "application/json" },
  });
});
