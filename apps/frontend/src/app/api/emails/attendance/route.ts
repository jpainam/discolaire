import { z } from "zod/v4";

import { sendEmail } from "@repo/utils/resend";

import { getSession } from "~/auth/server";
import { caller } from "~/trpc/server";
import { logger } from "~/utils/logger";

const schema = z.object({
  id: z.coerce.number(),
  type: z.enum(["absence", "chatter", "consigne", "lateness", "exclusion"]),
});

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return new Response("Not authenticated", { status: 401 });
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const reqBody = await req.json();
    const result = schema.safeParse(reqBody);
    if (!result.success) {
      const pretty = z.prettifyError(result.error);
      return new Response(pretty, { status: 400 });
    }
    const { id, type } = result.data;
    console.log(">>>>>>> type", type);
    const attendance = await caller.attendance.get(id);
    await completeSend("Présence", "Attendance Details", attendance.studentId);
    return new Response("OK", { status: 200 });
  } catch (e) {
    logger.error(e);
    return new Response(`An error occurred`, { status: 500 });
  }
}

async function completeSend(title: string, body: string, studentId: string) {
  const studentContacts = await caller.student.contacts(studentId);
  if (studentContacts.length === 0) {
    return new Response("Student has no contact", { status: 404 });
  }

  const contactEmails = studentContacts
    .map((c) => c.contact.user?.email)
    .filter((v): v is string => !!v && v !== "");

  await sendEmail({
    from: "Discolaire <hi@discolaire.com>",
    to: contactEmails,
    subject: title,
    html: body,
    text: body.replace(/<[^>]+>/g, ""), // Simple text fallback
  });
}
