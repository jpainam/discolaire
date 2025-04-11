import { z } from "zod";

import { renderToStream } from "@repo/reports";

import { auth } from "@repo/auth";
import { ReminderLetter } from "@repo/reports";
import { addDays } from "date-fns";
import i18next from "i18next";
import { sumBy } from "lodash";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { caller } from "~/trpc/server";

const querySchema = z.object({
  ids: z.string().optional(),
  format: z.enum(["pdf", "csv"]).optional(),
  dueDate: z.coerce
    .date()
    .optional()
    .default(() => addDays(new Date(), 7)),
});
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  const { id } = params;
  if (!id) {
    return NextResponse.json({ message: "No ID provided", status: 400 });
  }
  const searchParams = Object.fromEntries(request.nextUrl.searchParams);
  const parsedQuery = querySchema.safeParse(searchParams);
  if (!parsedQuery.success) {
    return NextResponse.json(
      { error: parsedQuery.error.format() },
      { status: 400 }
    );
  }
  try {
    const classroom = await caller.classroom.get(id);
    const school = await caller.school.getSchool();
    const { ids, dueDate } = parsedQuery.data;

    const fees = await caller.classroom.fees(id);
    const amountDue = sumBy(
      fees.filter((fee) => fee.dueDate <= new Date()),
      "amount"
    );

    let students = await caller.classroom.studentsBalance({ id });
    if (ids) {
      const selectedIds = ids.split(",");
      students = students.filter((stud) =>
        selectedIds.includes(stud.student.id)
      );
    }
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

    const stream = await renderToStream(
      ReminderLetter({
        school: school,
        dueDate: dueDate,
        reminders: reminders,
        classroom: classroom.name,
      })
    );

    //const blob = await new Response(stream).blob();

    const headers: Record<string, string> = {
      "Content-Type": "application/pdf",
      "Cache-Control": "no-store, max-age=0",
    };

    // @ts-expect-error TODO: fix this
    return new Response(stream, { headers });
  } catch (error) {
    console.error(error);
    return new Response(String(error), { status: 500 });
  }
}
