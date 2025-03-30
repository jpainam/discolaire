// import type { NextRequest } from "next/server";

// import { auth } from "@repo/auth";

// import { getServerTranslations } from "~/i18n/server";

// import WelcomeEmail from "@repo/transactional/emails/WelcomeEmail";
// import { nanoid } from "nanoid";
// import { resend } from "~/lib/resend";
// import { api } from "~/trpc/server";
// import { createUniqueInvite } from "~/actions/invite";

// export async function GET(req: NextRequest) {
//   try {
//     const session = await auth();
//     if (!session) {
//       return new Response("Not authenticated", { status: 401 });
//     }
//     const requestUrl = new URL(req.url);
//     const email = requestUrl.searchParams.get("email");
//     if (!email) {
//       return new Response("Invalid request", { status: 400 });
//     }
//     const { i18n } = await getServerTranslations();

//     const user = await api.user.getByEmail({ email });
//     if (!user) {
//       return new Response("User not found", { status: 404 });
//     }
//     if (!user.email) {
//       return new Response("Email not found", { status: 404 });
//     }
//     const school = await api.school.getSchool();

//     const token = await createUniqueInvite({
//       entityId: contact.id,
//       entityType: "contact",
//     });
//     const invitationLink = env.NEXT_PUBLIC_BASE_URL + "/invite/" + token;

//     const { error } = await resend.emails.send({
//       from: "Bienvenu <no-reply@discolaire.com>",
//       to: [email],
//       subject: "Bienvenue sur " + school.name,
//       headers: {
//         "X-Entity-Ref-ID": nanoid(),
//       },
//       react: WelcomeEmail({
//         fullName: user.name ?? "N/A",
//         url: invitationLink,
//       }) as React.ReactElement,
//     });
//     // await api.messaging.sendEmail({
//     //   subject: t("welcome_to_discolaire"),
//     //   to: email,
//     //   body: emailHtml,
//     // });

//     return Response.json({ success: true }, { status: 200 });
//   } catch (e) {
//     console.error(e);
//     return new Response(`An error occurred`, { status: 500 });
//   }
// }
