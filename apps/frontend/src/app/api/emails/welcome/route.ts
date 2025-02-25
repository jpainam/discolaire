import { render } from "@react-email/render";
import type { NextRequest } from "next/server";

import { auth } from "@repo/auth";
import { WelcomeEmail } from "@repo/transactional";
import { getServerTranslations } from "~/i18n/server";

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
    const { t, i18n } = await getServerTranslations();

    const user = await api.user.getByEmail({ email });
    if (!user) {
      return new Response("User not found", { status: 404 });
    }
    const emailHtml = await render(
      WelcomeEmail({
        fullName: user.name ?? "N/A",
        locale: i18n.language,
      }),
    );
    await api.messaging.sendEmail({
      subject: t("welcome_to_discolaire"),
      to: email,
      body: emailHtml,
    });

    return Response.json({ success: true }, { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response(`An error occurred`, { status: 500 });
  }
}
