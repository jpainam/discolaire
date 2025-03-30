import type { NextRequest } from "next/server";

import { auth } from "@repo/auth";
import { InviteEmail } from "@repo/transactional";
import { getServerTranslations } from "~/i18n/server";

import { nanoid } from "nanoid";
import { createUniqueInvite } from "~/actions/invite";
import { env } from "~/env";
import { resend } from "~/lib/resend";
import { api } from "~/trpc/server";

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
    const { i18n } = await getServerTranslations();
    if (user.email) {
      const invitation = await createUniqueInvite({
        entityId: user.id,
        entityType: user.profile,
      });

      const { error } = await resend.emails.send({
        from: "Invitation <no-reply@discolaire.com>",
        to: [user.email],
        subject: "Bienvenue sur " + school.name,
        headers: {
          "X-Entity-Ref-ID": nanoid(),
        },
        react: InviteEmail({
          invitedByEmail: user.email,
          invitedByName: user.name ?? "Admin",
          inviteLink: `${env.NEXT_PUBLIC_BASE_URL}/invite/${invitation}?email=${user.email}`,
          locale: i18n.language,
          school: {
            id: school.id,
            name: school.name,
            logo: school.logo,
          },
        }) as React.ReactElement,
      });
      if (error) {
        return Response.json({ error }, { status: 500 });
      }
    }
    return Response.json({ success: true }, { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response(`An error occurred`, { status: 500 });
  }
}
