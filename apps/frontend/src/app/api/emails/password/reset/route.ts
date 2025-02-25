/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { render } from "@react-email/render";
// TODO - Remove this import and use the `bcrypt` package from the `@repo/auth` package
import bcrypt from "bcrypt";
import crypto from "crypto";
import { addMinutes } from "date-fns";
import type { NextRequest } from "next/server";
import { z } from "zod";

import { ResetPassword } from "@repo/transactional";
import { getServerTranslations } from "~/i18n/server";

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

    const school = await api.school.getSchool();
    const { t, i18n } = await getServerTranslations();

    if (user.email) {
      const emailHtml = await render(
        ResetPassword({
          school: {
            id: school.id,
            name: school.name,
            logo: school.logo,
          },
          username: user.username,
          resetLink: `${env.NEXT_PUBLIC_BASE_URL}/auth/password/reset/?code=${hashedCode}`,
          locale: i18n.language,
        })
      );

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
