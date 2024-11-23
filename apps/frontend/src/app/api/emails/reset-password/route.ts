import type { NextRequest } from "next/server";
import { render } from "@react-email/render";

import { auth } from "@repo/auth";
import { ResetPassword } from "@repo/transactional";

import { api } from "~/trpc/server";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return new Response("Not authenticated", { status: 401 });
    }
    const requestUrl = new URL(req.url);
    const id = requestUrl.searchParams.get("id");
    if (!id) {
      return new Response("Invalid request", { status: 400 });
    }
    const user = await api.user.get(id);
    if (user?.email) {
      const emailHtml = await render(
        ResetPassword({
          username: user.username,
          resetLink: `https://discolaire.com/invite/${id}?email=${user.email}`,
        }),
      );
      await api.messaging.sendEmail({
        subject: "Reset password",
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
