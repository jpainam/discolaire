import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { render } from "@react-email/render";
import { z } from "zod/v4";

import { enqueueEmailJobs } from "@repo/messaging/client";
import { ResetPassword } from "@repo/transactional/emails/ResetPassword";

import { env } from "~/env";

const schema = z.object({
  url: z.string().min(1),
  email: z.email(),
  name: z.string().min(1),
});

export async function POST(req: NextRequest) {
  // Called by packages/auth (BetterAuth callbacks) without a user session.
  const apiKey = req.headers.get("x-api-key");
  if (!apiKey || apiKey !== env.DISCOLAIRE_API_KEY) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const body = await req.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      const error = z.treeifyError(result.error);
      return NextResponse.json(error, { status: 400 });
    }
    const { url, email, name } = result.data;

    const html = await render(
      ResetPassword({ username: name, resetLink: url, school: "IPBW" }),
    );

    await enqueueEmailJobs([
      {
        to: email,
        from: "Discolaire <contact@discolaire.com>",
        subject: "Réinitialisez votre mot de passe.",
        html,
      },
    ]);

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error }, { status: 500 });
  }
}
