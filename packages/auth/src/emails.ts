import { db } from "@repo/db";
import InvitationEmail from "@repo/transactional/emails/InvitationEmail";
import ResetPassword from "@repo/transactional/emails/ResetPassword";
import { sendEmail } from "@repo/utils";

export async function completeRegistration({
  user,
  url,
}: {
  user: { id: string; email: string; name: string };
  url: string;
}) {
  const newUser = await db.user.findUniqueOrThrow({
    where: { id: user.id },
  });
  const school = await db.school.findUniqueOrThrow({
    where: { id: newUser.schoolId },
  });
  await sendEmail({
    from: `Invitation ${school.name} <hi@discolaire.com>`,
    to: user.email,
    subject: "Bienvenue sur " + school.name,
    react: InvitationEmail({
      inviterName: user.name,
      inviteeName: user.name,
      schoolName: school.name,
      inviteLink: `${url}&id=${newUser.id}`,
    }) as React.ReactElement,
  });
}

export async function sendResetPassword({
  user,
  url,
}: {
  user: { id: string; email: string; name: string };
  url: string;
}) {
  const newUser = await db.user.findUniqueOrThrow({
    where: { id: user.id },
  });
  const school = await db.school.findUniqueOrThrow({
    where: { id: newUser.schoolId },
  });
  await sendEmail({
    from: `${school.name} <hi@discolaire.com>`,
    to: user.email,
    subject: "Réinitialisez votre mot de passe.",
    react: ResetPassword({
      username: newUser.username,
      resetLink: `${url}`,
      school: school.name,
    }) as React.ReactElement,
  });
}
