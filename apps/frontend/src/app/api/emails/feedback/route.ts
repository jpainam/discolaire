import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { render } from "@react-email/render";
import { z } from "zod/v4";

import FeedbackEmail from "@repo/transactional/emails/FeedbackEmail";

import { getSession } from "~/auth/server";
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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

    const html = await render(
      FeedbackEmail({
        message: content,
        usernameSender: user.username,
        emailSender: user.email,
        userId: user.id,
        school: { name: school.name, id: school.id },
      }),
    );

    await caller.sesEmail.enqueue({
      jobs: [
        {
          to: "jpainam@gmail.com",
          from: "Discolaire <contact@discolaire.com>",
          subject: "Feedback",
          html,
        },
      ],
    });

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error }, { status: 500 });
  }
}
