import type { NextRequest } from "next/server";
import { z } from "zod/v4";

import { enqueueEmailJobs } from "@repo/messaging/client";

import { env } from "~/env";

const schema = z.object({
  to: z.union([z.email(), z.array(z.email())]),
  subject: z.string().min(1),
  html: z.string().optional(),
  text: z.string().optional(),
  from: z.string().optional(),
});

/**
 * Internal endpoint for plain-text / simple HTML emails sent from packages
 * that cannot use the tRPC caller directly (e.g. packages/auth BetterAuth
 * callbacks for email verification, change-email, etc.).
 *
 * Protected by the internal DISCOLAIRE_API_KEY — never expose to the public.
 */
export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");
  if (!apiKey || apiKey !== env.DISCOLAIRE_API_KEY) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const body = await req.json();
    const result = schema.safeParse(body);
    if (!result.success) {
      return new Response(z.prettifyError(result.error), { status: 400 });
    }

    const { to, subject, html, text, from } = result.data;

    const htmlBody = html ?? (text ? `<p>${text}</p>` : null);
    if (!htmlBody) {
      return new Response("html or text is required", { status: 400 });
    }

    const recipients = Array.isArray(to) ? to : [to];
    await enqueueEmailJobs(
      recipients.map((recipient) => ({
        to: recipient,
        from: from ?? "Discolaire <contact@discolaire.com>",
        subject,
        html: htmlBody,
        text,
      })),
    );
    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[/api/emails/plain]", error);
    return new Response("An error occurred", { status: 500 });
  }
}
