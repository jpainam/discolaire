//import InvitationEmail from "@repo/transactional/emails/InvitationEmail";
//import { sendEmail } from "@repo/utils";

export async function completeRegistration() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  //   await sendEmail({
  //     from: `Rejoindre ${school.name} <hi@discolaire.com>`,
  //     to: [email],
  //     subject: "Bienvenue sur " + school.name,
  //     headers: {
  //       "X-Entity-Ref-ID": nanoid(),
  //     },
  //     react: InvitationEmail({
  //       inviterName: session.user.name,
  //       inviteeName: user.name,
  //       schoolName: school.name,
  //       inviteLink: `${env.NEXT_PUBLIC_BASE_URL}/invite/${invitation}?email=${user.email}`,
  //     }) as React.ReactElement,
  //   });
}
