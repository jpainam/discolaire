import type { NextRequest } from "next/server";
import { render } from "@react-email/render";

import { auth } from "@repo/auth";
import { SendInvite } from "@repo/transactional/emails/SendInvite";

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
      const emailHtml = render(
        SendInvite({
          username: user.username,
          invitedByUsername: "Admin",
          invitedByEmail: "",
        }),
      );
      await api.messaging.sendEmail({
        subject: "Invitation to join Discolaire",
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
