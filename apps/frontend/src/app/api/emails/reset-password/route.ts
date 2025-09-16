/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createErrorMap, fromError } from "zod-validation-error/v4";
import { z } from "zod/v4";

import ResetPassword from "@repo/transactional/emails/ResetPassword";

import { db } from "~/lib/db";
import { sendEmail } from "~/utils/send-email";

z.config({
  customError: createErrorMap({
    includePath: true,
  }),
});

const schema = z.object({
  url: z.string().min(1),
  email: z.email(),
  name: z.string().min(1),
  userId: z.string().min(1),
});
export async function POST(req: NextRequest) {
  // TOODO: Uncomment this when session management is implemented
  // const session = await getSession();

  // if (!session) {
  //   return new Response("Unauthorized", { status: 401 });
  // }

  try {
    const body = await req.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      const validationError = fromError(result.error);
      return NextResponse.json(
        { error: validationError.message },
        { status: 400 },
      );
    }
    const { url, email, name, userId } = result.data;
    const user = await db.user.findFirstOrThrow({
      where: { id: userId },
      include: {
        school: true,
      },
    });

    await sendEmail({
      from: `${user.school.name} <hi@discolaire.com>`,
      to: email,
      subject: "Réinitialisez votre mot de passe.",
      react: ResetPassword({
        username: name,
        resetLink: `${url}`,
        school: user.school.name,
      }) as React.ReactElement,
    });

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error }, { status: 500 });
  }
}
