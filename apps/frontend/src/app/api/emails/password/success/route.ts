/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { render } from "@react-email/render";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { z } from "zod";

import PasswordResetSuccess from "@repo/transactional/emails/PasswordResetSuccess";
import { getServerTranslations } from "~/i18n/server";

import { comparePasswords } from "@repo/auth/session";
import { caller } from "~/trpc/server";

const schema = z.object({
  email: z.string().email(),
  newPassword: z.string().min(1),
  code: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = schema.safeParse(body);
  if (!result.success) {
    return new Response("Invalid request", { status: 400 });
  }
  const { email, newPassword, code } = result.data;
  const resetRequest = await caller.passwordReset.getByEmail({
    email,
  });

  if (
    !resetRequest ||
    !(await comparePasswords(code, resetRequest.resetCode))
  ) {
    return new Response("Invalid reset code", { status: 400 });
  }
  const user = await caller.passwordReset.reset({
    userId: resetRequest.userId,
    password: newPassword,
  });
  // email email
  if (user.email) {
    const emailHtml = await render(PasswordResetSuccess());
    const { t } = await getServerTranslations();
    await caller.messaging.sendEmail({
      subject: t("password_reset_successful"),
      to: user.email,
      body: emailHtml,
    });
  }
  await caller.passwordReset.delete(resetRequest.id);

  redirect("/auth/login");
}
