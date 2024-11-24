import type { NextRequest } from "next/server";
import { render } from "@react-email/render";
import { z } from "zod";

import { auth } from "@repo/auth";
import { WelcomeEmail } from "@repo/transactional";

import { api } from "~/trpc/server";

const paramsSchema = z.object({
  id: z.string().min(1),
});
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return new Response("Not authenticated", { status: 401 });
    }
    const requestUrl = new URL(req.url);
    const obj: Record<string, string> = {};

    for (const [key, value] of requestUrl.searchParams.entries()) {
      obj[key] = value;
    }
    const result = paramsSchema.safeParse(obj);
    if (!result.success) {
      return new Response("Invalid parameters", { status: 400 });
    }
    const { id } = result.data;
    const user = await api.user.get(id);
    if (user?.email) {
      const emailHtml = await render(
        WelcomeEmail({
          fullName: "Jean-Paul Ainam",
          locale: "fr",
        }),
      );
      await api.messaging.sendEmail({
        subject: "Welcome to Discolaire",
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
