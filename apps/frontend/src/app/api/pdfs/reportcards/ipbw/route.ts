import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import { z } from "zod/v4";

import { parseSearchParams } from "~/app/api/utils";
import { getSession } from "~/auth/server";
import IPBW from "~/reports/reportcards/IPBW";
import { caller } from "~/trpc/server";

const searchSchema = z.object({
  studentId: z.string().optional(),
  classroomId: z.string().optional(),
  termId: z.string().min(1),
});
export async function GET(req: NextRequest) {
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

  const { studentId, termId, classroomId } = result.data;
  if (studentId) {
    return indvidualReportCard({ studentId, termId });
  } else if (classroomId) {
    return classroomReportCard({ classroomId, termId });
  }

  //const schoolYear = await caller.schoolYear.get(classroom.schoolYearId);
  //const totalPoints = sum(reportCard.map((c) => 20 * c.coefficient));
}

async function classroomReportCard({
  classroomId,
  termId,
}: {
  classroomId: string;
  termId: string;
}) {
  const school = await caller.school.getSchool();
  const students = await caller.classroom.students(classroomId);
  const contacts = await caller.student.getPrimaryContacts({ classroomId });
  const report = await caller.reportCard.getSequence({
    classroomId,
    termId,
  });

  const subjects = await caller.classroom.subjects(classroomId);
  const term = await caller.term.get(termId);
  const classroom = await caller.classroom.get(classroomId);

  const disciplines = await caller.discipline.sequence({
    classroomId,
    termId,
  });
  const lang = classroom.section?.name == "ANG" ? "en" : "fr";

  const stream = await renderToStream(
    IPBW({
      school,
      students,
      disciplines,
      classroom,
      title:
        classroom.section?.name == "FRA"
          ? `BULLETIN SCOLAIRE : ${term.name}`
          : `MONTHLY PROGRESS REPORT CARD N° ${term.order}`,
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
}
async function indvidualReportCard({
  studentId,
  termId,
}: {
  studentId: string;
  termId: string;
}) {
  const student = await caller.student.get(studentId);
  if (!student.classroom) {
    return new Response("Student not registered", { status: 400 });
  }

  const report = await caller.reportCard.getSequence({
    classroomId: student.classroom.id,
    termId,
  });

  const subjects = await caller.classroom.subjects(student.classroom.id);
  const classroom = await caller.classroom.get(student.classroom.id);

  const studentReport = report.studentsReport.get(studentId);
  const globalRank = report.globalRanks.get(studentId);
  if (!studentReport || !globalRank) {
    return new Response("Student has no grades", { status: 400 });
  }

  const contacts = await caller.student.getPrimaryContacts({
    classroomId: classroom.id,
  });
  const school = await caller.school.getSchool();
  const term = await caller.term.get(termId);

  const disciplines = await caller.discipline.sequence({
    classroomId: classroom.id,
    termId,
  });
  const lang = classroom.section?.name == "ANG" ? "en" : ("fr" as const);

  const stream = await renderToStream(
    IPBW({
      school,
      disciplines: disciplines,
      students: [student],
      lang: lang,
      classroom,
      title:
        lang == "fr"
          ? `BULLETIN SCOLAIRE : ${term.name}`
          : `MONTHLY PROGRESS REPORT CARD N° ${term.order}`,
      subjects,
      report,
      contacts: contacts.filter((contact) => contact.studentId === student.id),
      schoolYear: classroom.schoolYear,
    }),
  );

  const headers: Record<string, string> = {
    "Content-Type": "application/pdf",
    "Cache-Control": "no-store, max-age=0",
  };

  // @ts-expect-error TODO: fix this
  return new Response(stream, { headers });
}
