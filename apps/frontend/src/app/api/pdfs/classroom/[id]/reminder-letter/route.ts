import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import { addDays } from "date-fns";
import { sumBy } from "lodash";
import { getLocale } from "next-intl/server";
import { z } from "zod/v4";

import { getSession } from "~/auth/server";
import ReminderLetter from "~/reports/statements/ReminderLetter";
import { caller } from "~/trpc/server";
import { getFullName } from "~/utils";

const querySchema = z.object({
  ids: z.string().optional(),
  format: z.enum(["pdf", "csv"]).optional(),
  journalId: z.string().min(1),
  dueDate: z.coerce
    .date()
    .optional()
    .default(() => addDays(new Date(), 7)),
});
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ message: "No ID provided", status: 400 });
  }
  const searchParams = Object.fromEntries(request.nextUrl.searchParams);
  const parsedQuery = querySchema.safeParse(searchParams);
  if (!parsedQuery.success) {
    return NextResponse.json(
      { error: parsedQuery.error.format() },
      { status: 400 },
    );
  }
  try {
    const classroom = await caller.classroom.get(id);
    const school = await caller.school.getSchool();
    const { ids, dueDate, journalId } = parsedQuery.data;
    const locale = await getLocale();
    const fees = (await caller.classroom.fees(id)).filter((fee) => {
      return fee.journalId === journalId;
    });
    const amountDue = sumBy(
      fees.filter((fee) => fee.dueDate <= new Date()),
      "amount",
    );

    let students = await caller.classroom.studentsBalance({ id, journalId });
    if (ids) {
      const selectedIds = ids.split(",");
      students = students.filter((stud) =>
        selectedIds.includes(stud.studentId),
      );
    }
    const reminders = students
      .filter((stud) => stud.balance - amountDue < 0)
      .map((stud) => {
        return {
          studentName: getFullName(stud),
          amount: (amountDue - stud.balance).toLocaleString(locale, {
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
      }),
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
