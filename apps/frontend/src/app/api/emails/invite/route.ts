import { render } from "@react-email/render";
import type { NextRequest } from "next/server";

import { auth } from "@repo/auth";
import { InviteEmail } from "@repo/transactional";
import { getServerTranslations } from "~/i18n/server";

import { env } from "~/env";
import { api } from "~/trpc/server";
import { createUniqueInvite } from "~/actions/invite";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return new Response("Not authenticated", { status: 401 });
    }
    const requestUrl = new URL(req.url);
    const email = requestUrl.searchParams.get("email");
    if (!email) {
      return new Response("Invalid request", { status: 400 });
    }
    const user = session.user;
    const school = await api.school.getSchool();
    const { t, i18n } = await getServerTranslations();
    if (user.email) {
      const invitation = await createUniqueInvite({
        entityId: user.id,
        entityType: user.profile,
      });
      const emailHtml = await render(
        InviteEmail({
          invitedByEmail: user.email,
          invitedByName: user.name ?? "Admin",
          inviteLink: `${env.NEXT_PUBLIC_BASE_URL}/invite/${invitation}?email=${user.email}`,
          locale: i18n.language,
          school: {
            id: school.id,
            name: school.name,
            logo: school.logo,
          },
        })
      );
      await api.messaging.sendEmail({
        subject: t("join", { school: school.name }),
        to: email,
        body: emailHtml,
      });
    }
    return Response.json({ success: true }, { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response(`An error occurred`, { status: 500 });
  }
}
