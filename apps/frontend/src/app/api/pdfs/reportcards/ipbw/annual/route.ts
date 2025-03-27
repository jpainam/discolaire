import type { NextRequest } from "next/server";
import { z } from "zod";

import { auth } from "@repo/auth";
import { db } from "@repo/db";
import { renderToStream } from "@repo/reports";
import { IPBWAnnual } from "@repo/reports/reportcards/IPBWAnnual";
import { api, caller } from "~/trpc/server";

const searchSchema = z.object({
  studentId: z.string().nullable(),
  classroomId: z.string().nullable(),
});
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  const studId = req.nextUrl.searchParams.get("studentId");
  const classId = req.nextUrl.searchParams.get("classroomId");

  const result = searchSchema.safeParse({
    studentId: studId,
    classroomId: classId,
  });
  if (!result.success) {
    const errors = result.error.errors.map((error) => ({
      path: error.path.join("."),
      message: error.message,
    }));

    return Response.json(
      { error: "Invalid request body", errors },
      { status: 400 }
    );
  }

  const { studentId, classroomId } = result.data;
  if (studentId) {
    return indvidualReportCard({ studentId });
  } else if (classroomId) {
    return classroomReportCard({ classroomId });
  }
}

async function classroomReportCard({ classroomId }: { classroomId: string }) {
  const school = await api.school.getSchool();
  const students = await api.classroom.students(classroomId);
  const contacts = await api.student.getPrimaryContacts({ classroomId });
  const report = await caller.reportCard.getAnnualReport({
    classroomId,
  });

  const subjects = await api.classroom.subjects(classroomId);
  const classroom = await caller.classroom.get(classroomId);

  const terms = await db.term.findMany({
    orderBy: { order: "asc" },
    where: {
      schoolYearId: classroom.schoolYearId,
      schoolId: classroom.schoolId,
    },
  });
  if (terms.length !== 6) {
    return Response.json({ error: "Invalid number of terms" }, { status: 400 });
  }
  const disc1 = await caller.discipline.classroom({
    classroomId: classroomId,
    termId: terms[0]?.id ?? 0,
  });
  const disc2 = await caller.discipline.classroom({
    classroomId: classroomId,
    termId: terms[1]?.id ?? 0,
  });
  const disc3 = await caller.discipline.classroom({
    classroomId: classroomId,
    termId: terms[2]?.id ?? 0,
  });
  const disc4 = await caller.discipline.classroom({
    classroomId: classroomId,
    termId: terms[3]?.id ?? 0,
  });
  const disc5 = await caller.discipline.classroom({
    classroomId: classroomId,
    termId: terms[4]?.id ?? 0,
  });
  const disc6 = await caller.discipline.classroom({
    classroomId: classroomId,
    termId: terms[5]?.id ?? 0,
  });

  const stream = await renderToStream(
    IPBWAnnual({
      school,
      students,
      discipline: {
        disc1,
        disc2,
      },
      classroom,
      subjects,
      report,
      contacts,
      schoolYear: classroom.schoolYear,
    })
  );

  const headers: Record<string, string> = {
    "Content-Type": "application/pdf",
    "Cache-Control": "no-store, max-age=0",
  };
  // @ts-expect-error TODO: fix this
  return new Response(stream, { headers });
}
async function indvidualReportCard({ studentId }: { studentId: string }) {
  const student = await api.student.get(studentId);
  if (!student.classroom) {
    return new Response("Student not registered", { status: 400 });
  }

  const report = await caller.reportCard.getAnnualReport({
    classroomId: student.classroom.id,
  });

  const subjects = await api.classroom.subjects(student.classroom.id);
  const classroom = await caller.classroom.get(student.classroom.id);

  const studentReport = report.studentsReport.get(studentId);
  const globalRank = report.globalRanks.get(studentId);
  if (!studentReport || !globalRank) {
    return new Response("Student has no grades", { status: 400 });
  }

  const contact = await api.student.getPrimaryContact(student.id);
  const school = await api.school.getSchool();

  const terms = await caller.term.fromTrimestre(trimestreId);
  const disc1 = await caller.discipline.student({
    studentId: studentId,
    termId: terms.seq1?.id ?? 0,
  });
  const disc2 = await caller.discipline.student({
    studentId: studentId,
    termId: terms.seq2?.id ?? 0,
  });

  const stream = await renderToStream(
    IPBWAnnual({
      school,
      studentId,
      classroom,
      subjects,
      report,
      contacts: [contact],
      schoolYear: classroom.schoolYear,
    })
  );

  const headers: Record<string, string> = {
    "Content-Type": "application/pdf",
    "Cache-Control": "no-store, max-age=0",
  };

  // @ts-expect-error TODO: fix this
  return new Response(stream, { headers });
}
