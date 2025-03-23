import type { NextRequest } from "next/server";
import { z } from "zod";

import { IPBW, IPBWClassroom, renderToStream } from "@repo/reports";

import { auth } from "@repo/auth";
import { api, caller } from "~/trpc/server";

const searchSchema = z.object({
  studentId: z.string().nullable(),
  classroomId: z.string().nullable(),
  termId: z.coerce.number(),
});
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  const studId = req.nextUrl.searchParams.get("studentId");
  const term = req.nextUrl.searchParams.get("termId");
  const classId = req.nextUrl.searchParams.get("classroomId");

  const result = searchSchema.safeParse({
    studentId: studId,
    termId: term,
    classroomId: classId,
  });
  if (!result.success) {
    const errors = result.error.errors.map((error) => ({
      path: error.path.join("."),
      message: error.message,
    }));

    return Response.json(
      { error: "Invalid request body", errors },
      { status: 400 },
    );
  }

  const { studentId, termId, classroomId } = result.data;
  if (studentId) {
    return indvidualReportCard({ studentId, termId });
  } else if (classroomId) {
    return classroomReportCard({ classroomId, termId });
  }

  //const schoolYear = await api.schoolYear.get(classroom.schoolYearId);
  //const totalPoints = sum(reportCard.map((c) => 20 * c.coefficient));
}

async function classroomReportCard({
  classroomId,
  termId,
}: {
  classroomId: string;
  termId: number;
}) {
  const school = await api.school.getSchool();
  const classroom = await api.classroom.get(classroomId);
  const { result: results, summary: _summary } =
    await api.reportCard.getClassroom({
      termId,
      classroomId,
    });
  const grades = await api.reportCard.getGrades2({
    classroomId: classroomId,
    termId: termId,
  });
  const students = await api.classroom.students(classroomId);

  const contacts = await api.student.getPrimaryContacts({ classroomId });
  const subjects = await api.classroom.subjects(classroomId);
  const stream = await renderToStream(
    IPBWClassroom({
      school,
      classroom,
      subjects,
      students: students,
      schoolYear: classroom.schoolYear,
      grades,
      contacts,
      results: results.sort((a, b) => a.rank - b.rank),
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
  termId: number;
}) {
  const student = await api.student.get(studentId);
  if (!student.classroom) {
    return new Response("Student not registered", { status: 400 });
  }

  const report = await caller.reportCard.getSequence({
    classroomId: student.classroom.id,
    termId: termId,
  });

  const subjects = await api.classroom.subjects(student.classroom.id);
  const classroom = await caller.classroom.get(student.classroom.id);

  const studentReport = report.studentsReport.get(studentId);
  const globalRank = report.globalRanks.get(studentId);
  if (!studentReport || !globalRank) {
    return new Response("Student has no grades", { status: 400 });
  }

  //TODO respect In case there are ex-aequo
  const contact = await api.student.getPrimaryContact(student.id);
  const school = await api.school.getSchool();

  const stream = await renderToStream(
    IPBW({
      school,
      student,
      classroom,
      subjects,
      report,
      contact,
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
