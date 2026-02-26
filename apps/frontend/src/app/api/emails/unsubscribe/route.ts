import type { NextRequest } from "next/server";

import { env } from "~/env";
import { verifyUnsubscribeToken } from "~/lib/unsubscribe-token";

export const runtime = "nodejs";

/**
 * GET /api/emails/unsubscribe?token=<signed-token>
 *
 * Shown when a user clicks an unsubscribe link inside an email body.
 * Returns a simple HTML confirmation page.
 */
export async function GET(req: NextRequest) {
  await new Promise((resolve) => setTimeout(resolve, 1));
  const token = req.nextUrl.searchParams.get("token") ?? "";
  const payload = verifyUnsubscribeToken(token, env.AUTH_SECRET);

  if (!payload) {
    return new Response("Invalid or expired unsubscribe link.", {
      status: 400,
      headers: { "Content-Type": "text/plain" },
    });
  }

  // TODO: persist the unsubscribe preference in the DB
  // e.g. await db.emailUnsubscribe.upsert({ where: { email_type: ... }, ... })
  console.log(
    `[unsubscribe] GET – email=${payload.email} type=${payload.emailType} tenant=${payload.tenant}`,
  );

  const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>Désabonnement</title></head>
<body style="font-family:sans-serif;max-width:480px;margin:60px auto;text-align:center">
  <h1>Vous êtes désabonné(e)</h1>
  <p>Vous ne recevrez plus d'emails de ce type</p>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

/**
 * POST /api/emails/unsubscribe?token=<signed-token>
 *
 * Called by Gmail's one-click unsubscribe (RFC 8058).
 * Body will contain: List-Unsubscribe=One-Click
 * Must return 2xx quickly.
 */
export async function POST(req: NextRequest) {
  await new Promise((resolve) => setTimeout(resolve, 1));
  const token = req.nextUrl.searchParams.get("token") ?? "";
  const payload = verifyUnsubscribeToken(token, env.AUTH_SECRET);

  if (!payload) {
    return new Response("Invalid token.", { status: 400 });
  }

  // TODO: persist the unsubscribe preference in the DB
  console.log(
    `[unsubscribe] POST (one-click) - email=${payload.email} type=${payload.emailType} tenant=${payload.tenant}`,
  );

  return new Response(null, { status: 200 });
}
