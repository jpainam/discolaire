import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import { z } from "zod/v4";

import type { RouterOutputs } from "@repo/api";

import { parseSearchParams } from "~/app/api/utils";
import { getSession } from "~/auth/server";
import { IPBWCompetence } from "~/reports/reportcards/IPBWCompetence";
import { caller, getQueryClient, trpc } from "~/trpc/server";

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
  const queryClient = getQueryClient();
  const school = await queryClient.fetchQuery(
    trpc.school.getSchool.queryOptions(),
  );
  const term = await queryClient.fetchQuery(trpc.term.get.queryOptions(termId));
  if (studentId) {
    return indvidualReportCard({ studentId, termId, school, term });
  } else if (classroomId) {
    return classroomReportCard({ classroomId, termId, school, term });
  }
}

async function classroomReportCard({
  classroomId,
  termId,
  school,
  term,
}: {
  classroomId: string;
  termId: string;
  school: RouterOutputs["school"]["getSchool"];
  term: RouterOutputs["term"]["get"];
}) {
  const queryClient = getQueryClient();
  const skills = await queryClient.fetchQuery(
    trpc.skillAcquisition.all.queryOptions({
      classroomId,
      termId,
    }),
  );

  const students = await queryClient.fetchQuery(
    trpc.classroom.students.queryOptions(classroomId),
  );
  const contacts = await queryClient.fetchQuery(
    trpc.student.getPrimaryContacts.queryOptions({ classroomId }),
  );
  const report = await queryClient.fetchQuery(
    trpc.reportCard.getSequence.queryOptions({
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
    trpc.discipline.sequence.queryOptions({
      classroomId,
      termId,
    }),
  );
  const lang = classroom.section?.name == "ANG" ? "en" : "fr";

  const stream = await renderToStream(
    IPBWCompetence({
      school,
      students,
      disciplines,
      term,
      classroom,
      skills,
      title:
        classroom.section?.name == "FRA"
          ? `BULLETIN SCOLAIRE : ${term.name}`
          : `MONTHLY PROGRESS REPORT CARD N° ${term.order + 1}`,
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
  school,
  term,
}: {
  studentId: string;
  termId: string;
  school: RouterOutputs["school"]["getSchool"];
  term: RouterOutputs["term"]["get"];
}) {
  const queryClient = getQueryClient();
  const student = await queryClient.fetchQuery(
    trpc.student.get.queryOptions(studentId),
  );
  if (!student.classroom) {
    return NextResponse.json("Eleve non inscrit", { status: 401 });
  }
  const classroomId = student.classroom.id;
  const skills = await queryClient.fetchQuery(
    trpc.skillAcquisition.all.queryOptions({
      classroomId,
      termId,
    }),
  );

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

  const contact = await caller.student.getPrimaryContact(student.id);

  const disciplines = await caller.discipline.sequence({
    classroomId: classroom.id,
    termId,
  });
  const lang = classroom.section?.name == "ANG" ? "en" : ("fr" as const);

  const stream = await renderToStream(
    IPBWCompetence({
      school,
      disciplines: disciplines,
      students: [student],
      lang: lang,
      term,
      skills,
      classroom,
      title:
        lang == "fr"
          ? `BULLETIN SCOLAIRE : ${term.name}`
          : `MONTHLY PROGRESS REPORT CARD N° ${term.order + 1}`,
      subjects,
      report,
      contacts: contact ? [contact] : [],
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
