/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";

import { renderToStream } from "@repo/reports";

import { auth } from "@repo/auth";
import { ReminderLetter } from "@repo/reports";
import i18next from "i18next";
import { sumBy } from "lodash";
import { api } from "~/trpc/server";

const schema = z.object({
  classroomId: z.string().min(1),
});
export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    const reqBody = await req.json();
    const result = schema.safeParse(reqBody);
    if (!result.success) {
      const error = result.error.errors.map((e) => e.message).join(", ");
      return new Response(error, { status: 400 });
    }

    const { classroomId } = result.data;
    const classroom = await api.classroom.get(classroomId);

    const fees = await api.classroom.fees(classroomId);
    const amountDue = sumBy(
      fees.filter((fee) => fee.dueDate <= new Date()),
      "amount"
    );
    const students = await api.classroom.studentsBalance({ id: classroomId });
    const reminders = students
      .filter((stud) => stud.balance - amountDue < 0)
      .map((stud) => {
        return {
          studentName: stud.student.firstName + " " + stud.student.lastName,
          amount: (amountDue - stud.balance).toLocaleString(i18next.language, {
            style: "currency",
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
            currency: school.currency,
          }),
        };
      });

    const school = await api.school.getSchool();

    const stream = await renderToStream(
      ReminderLetter({
        school: school,
        reminders: reminders,
        classroom: classroom.name,
      })
    );

    //const blob = await new Response(stream).blob();
    const filename = crypto.randomUUID();
    const headers: Record<string, string> = {
      "Content-Type": "application/pdf",
      "Cache-Control": "no-store, max-age=0",
      "Content-Disposition": `attachment; filename="Liste-${filename}.pdf"`,
    };

    // @ts-expect-error TODO: fix this
    return new Response(stream, { headers });
  } catch (error) {
    console.error(error);
    return new Response(String(error), { status: 500 });
  }
}
