/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import type { NextRequest } from "next/server";
import { z } from "zod";

import { auth } from "@repo/auth/session";
import { resend } from "@repo/notification";
import FeedbackEmail from "@repo/transactional/emails/FeedbackEmail";
import { api } from "~/trpc/server";

const schema = z.object({
  content: z.string().email(),
});
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    const body = await req.json();
    const result = schema.safeParse(body);
    if (!result.success) {
      return new Response("Invalid request", { status: 400 });
    }
    const { content } = result.data;
    const { user } = session;
    const school = await api.school.getSchool();
    const { data, error } = await resend.emails.send({
      from: "Feedback <no-reply@discolaire.com>",
      to: ["jpainam@gmail.com"],
      subject: "Feedback",
      react: FeedbackEmail({
        message: content,
        usernameSender: user.username,
        emailSender: user.email ?? "",
        userId: user.id,
        school: { name: school.name, id: school.id },
      }) as React.ReactElement,
    });
    console.log("feedback send with data", data);
    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error }, { status: 500 });
  }
}
