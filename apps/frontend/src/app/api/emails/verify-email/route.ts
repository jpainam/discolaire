import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { render } from "@react-email/render";
import { z } from "zod/v4";

import { getDb } from "@repo/db";
import { enqueueEmailJobs } from "@repo/messaging/client";
import VerificationEmail from "@repo/transactional/emails/VerificationEmail";

import { env } from "~/env";
import { getRequestBaseUrl } from "~/lib/base-url.server";
import { buildLogoUrl } from "~/lib/utils";

const schema = z.object({
  url: z.string().min(1),
  email: z.email(),
  name: z.string().min(1),
  tenant: z.string().min(1),
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
    const { url, email, name, tenant } = result.data;

    const db = getDb({ connectionString: env.DATABASE_URL, tenant });
    const [school, baseUrl] = await Promise.all([
      db.school.findFirst({ select: { name: true, logo: true } }),
      getRequestBaseUrl(req.headers),
    ]);

    const schoolName = school?.name ?? tenant.toUpperCase();

    const html = await render(
      VerificationEmail({
        username: name,
        verificationLink: url,
        schoolName,
        logo: buildLogoUrl(school?.logo, baseUrl) ?? "",
      }),
    );

    await enqueueEmailJobs([
      {
        to: email,
        from: `${schoolName} <contact@discolaire.com>`,
        subject: "Vérifiez votre adresse e-mail",
        html,
      },
    ]);

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error }, { status: 500 });
  }
}
