import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import { z } from "zod/v4";

import { parseSearchParams } from "~/app/api/utils";
import { getSession } from "~/auth/server";
import { IPBWAnnual } from "~/reports/reportcards/IPBWAnnual";
import { getQueryClient, trpc } from "~/trpc/server";

const searchSchema = z.object({
  studentId: z.string().optional(),
  classroomId: z.string().min(1),
  termId: z.string().min(1),
});
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }
    const searchParams = parseSearchParams(req);

    const result = searchSchema.safeParse(searchParams);
    if (!result.success) {
      const error = z.treeifyError(result.error);
      return NextResponse.json(error, { status: 400 });
    }

    const { studentId, classroomId, termId } = result.data;
    const queryClient = getQueryClient();
    const school = await queryClient.fetchQuery(
      trpc.school.getSchool.queryOptions(),
    );
    let students = await queryClient.fetchQuery(
      trpc.classroom.students.queryOptions(classroomId),
    );
    if (studentId) {
      students = students.filter((s) => s.id === studentId);
    }
    const contacts = await queryClient.fetchQuery(
      trpc.student.getPrimaryContacts.queryOptions({ classroomId }),
    );
    const report = await queryClient.fetchQuery(
      trpc.reportCard.getAnnualReport.queryOptions({
        classroomId,
        termId,
      }),
    );

    const subjects = await queryClient.fetchQuery(
      trpc.classroom.subjects.queryOptions(classroomId),
    );
    const classroom = await queryClient.fetchQuery(
      trpc.classroom.get.queryOptions(classroomId),
    );
    const disciplines = await queryClient.fetchQuery(
      trpc.discipline.annual.queryOptions({ classroomId }),
    );
    const lang = classroom.section?.name == "ANG" ? "en" : ("fr" as const);
    const stream = await renderToStream(
      IPBWAnnual({
        school,
        students,
        disciplines,
        classroom,
        subjects,
        report,
        contacts,
        lang,
        schoolYear: classroom.schoolYear,
      }),
    );

    const headers: Record<string, string> = {
      "Content-Type": "application/pdf",
      "Cache-Control": "no-store, max-age=0",
    };
    // @ts-expect-error TODO: fix this
    return new Response(stream, { headers });
  } catch (err) {
    console.error(err);
    return NextResponse.json(err, { status: 500 });
  }
}
