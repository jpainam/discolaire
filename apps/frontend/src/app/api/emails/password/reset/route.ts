import crypto from "crypto";
import type { NextRequest } from "next/server";
import { render } from "@react-email/render";
import bcrypt from "bcrypt";
import { addMinutes } from "date-fns";
import { z } from "zod";

import { getServerTranslations } from "@repo/i18n/server";
import { ResetPassword } from "@repo/transactional";

import { env } from "~/env";
import { api } from "~/trpc/server";

const schema = z.object({
  email: z.string().email(),
});
export async function POST(req: NextRequest) {
  try {
    //const requestUrl = new URL(req.url);
    const body = await req.json();
    const result = schema.safeParse(body);
    if (!result.success) {
      return new Response("Invalid request", { status: 400 });
    }
    const { email } = result.data;
    const user = await api.user.getByEmail({ email });
    if (!user) {
      return new Response("User not found", { status: 404 });
    }
    const secretCode = crypto.randomBytes(32).toString("hex");
    const hashedCode = await bcrypt.hash(secretCode, 12);
    const expiresAt = addMinutes(new Date(), 15); // Set expiration time to 15 minutes

    await api.passwordReset.createResetCode({
      userId: user.id,
      resetCode: secretCode,
      expiresAt: expiresAt,
    });

    if (user.email) {
      const emailHtml = render(
        ResetPassword({
          username: user.username,
          resetLink: `${env.NEXT_PUBLIC_BASE_URL}/auth/password/reset/?code=${hashedCode}`,
        }),
      );
      const { t } = await getServerTranslations();
      await api.messaging.sendEmail({
        subject: t("reset_password"),
        to: user.email,
        body: emailHtml,
      });
    }
    return Response.json({ success: true }, { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response(`An error occurred`, { status: 500 });
  }
}
