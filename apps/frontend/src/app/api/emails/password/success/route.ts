import type { NextRequest } from "next/server";
import { redirect } from "next/navigation";
import { render } from "@react-email/render";
import bcrypt from "bcrypt";
import { z } from "zod";

import { getServerTranslations } from "@repo/i18n/server";
import PasswordResetSuccess from "@repo/transactional/emails/PasswordResetSuccess";

import { api } from "~/trpc/server";

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
  const resetRequest = await api.passwordReset.getByEmail({
    email,
  });

  if (!resetRequest || !(await bcrypt.compare(code, resetRequest.resetCode))) {
    return new Response("Invalid reset code", { status: 400 });
  }
  const user = await api.passwordReset.reset({
    userId: resetRequest.userId,
    password: newPassword,
  });
  // email email
  if (user.email) {
    const emailHtml = render(PasswordResetSuccess());
    const { t } = await getServerTranslations();
    await api.messaging.sendEmail({
      subject: t("password_reset_successful"),
      to: user.email,
      body: emailHtml,
    });
  }
  await api.passwordReset.delete(resetRequest.id);

  redirect("/auth/login");
}
