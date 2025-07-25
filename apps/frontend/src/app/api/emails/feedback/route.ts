/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { z } from "zod";

import FeedbackEmail from "@repo/transactional/emails/FeedbackEmail";

import { getSession } from "~/auth/server";
import { resend } from "~/lib/resend";
import { caller } from "~/trpc/server";

const schema = z.object({
  content: z.string().min(1),
});
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    const body = await req.json();
    const result = schema.safeParse(body);
    if (!result.success) {
      const errors = result.error.format();
      console.error(errors);
      return NextResponse.json(
        { error: result.error.format() },
        { status: 400 },
      );
    }
    const { content } = result.data;
    const { user } = session;
    const school = await caller.school.getSchool();
    const { error } = await resend.emails.send({
      from: "Feedback <hi@discolaire.com>",
      to: ["jpainam@gmail.com"],
      subject: "Feedback",
      headers: {
        "X-Entity-Ref-ID": nanoid(),
      },
      react: FeedbackEmail({
        message: content,
        usernameSender: user.username,
        emailSender: user.email,
        userId: user.id,
        school: { name: school.name, id: school.id },
      }) as React.ReactElement,
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error }, { status: 500 });
  }
}
