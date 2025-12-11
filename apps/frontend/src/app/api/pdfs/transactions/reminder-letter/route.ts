import type { NextRequest } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import { z } from "zod/v4";

import { parseSearchParams } from "~/app/api/utils";
import { getSession } from "~/auth/server";
import ReminderLetter from "~/reports/statements/ReminderLetter";
import { getQueryClient, trpc } from "~/trpc/server";

const searchSchema = z.object({
  classroomId: z.string().min(1),
  studentId: z.string().optional(),
  journalId: z.string().min(1),
  dueDate: z.coerce.date(),
});
const sum = (a: number[]) => a.reduce((acc, val) => acc + val, 0);
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    const searchParams = parseSearchParams(req);

    const result = searchSchema.safeParse(searchParams);
    if (!result.success) {
      const error = result.error.issues.map((e) => e.message).join(", ");
      return new Response(error, { status: 400 });
    }
    const { journalId, dueDate, studentId, classroomId } = result.data;
    const queryClient = getQueryClient();

    const classroom = await queryClient.fetchQuery(
      trpc.classroom.get.queryOptions(classroomId),
    );
    const school = await queryClient.fetchQuery(
      trpc.school.getSchool.queryOptions(),
    );

    const fees = (
      await queryClient.fetchQuery(
        trpc.classroom.fees.queryOptions(classroomId),
      )
    ).filter((fee) => {
      return fee.journalId === journalId;
    });
    const amountDue = sum(
      fees.filter((fee) => fee.dueDate <= new Date()).map((fee) => fee.amount),
    );

    let students = await queryClient.fetchQuery(
      trpc.classroom.studentsBalance.queryOptions(classroomId),
    );
    if (studentId) {
      students = students.filter((stud) => stud.studentId === studentId);
    }

    const stream = await renderToStream(
      ReminderLetter({
        school: school,
        dueDate: dueDate,
        students: students,
        amountDue: amountDue,
        journalId: journalId,
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
