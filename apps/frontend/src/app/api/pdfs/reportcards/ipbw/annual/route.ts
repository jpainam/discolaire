import type { NextRequest } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import { z } from "zod/v4";

import { getSession } from "~/auth/server";
import { IPBWAnnual } from "~/reports/reportcards/IPBWAnnual";
import { caller } from "~/trpc/server";

const searchSchema = z.object({
  studentId: z.string().nullable(),
  classroomId: z.string().nullable(),
});
export async function GET(req: NextRequest) {
  const session = await getSession();
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
      { status: 400 },
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
  const school = await caller.school.getSchool();
  const students = await caller.classroom.students(classroomId);
  const contacts = await caller.student.getPrimaryContacts({ classroomId });
  const report = await caller.reportCard.getAnnualReport({
    classroomId,
  });

  const subjects = await caller.classroom.subjects(classroomId);
  const classroom = await caller.classroom.get(classroomId);
  const disciplines = await caller.discipline.annual({ classroomId });
  const stream = await renderToStream(
    IPBWAnnual({
      school,
      students,
      disciplines,
      classroom,
      subjects,
      report,
      contacts,
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
async function indvidualReportCard({ studentId }: { studentId: string }) {
  const student = await caller.student.get(studentId);
  if (!student.classroom) {
    return new Response("Student not registered", { status: 400 });
  }

  const report = await caller.reportCard.getAnnualReport({
    classroomId: student.classroom.id,
  });

  const subjects = await caller.classroom.subjects(student.classroom.id);
  const classroom = await caller.classroom.get(student.classroom.id);

  const studentReport = report.studentsReport.get(studentId);
  const globalRank = report.globalRanks.get(studentId);
  if (!studentReport || !globalRank) {
    return new Response("Student has no grades", { status: 400 });
  }

  const contact = await caller.student.getPrimaryContact(student.id);
  const school = await caller.school.getSchool();

  const disciplines = await caller.discipline.annual({
    classroomId: student.classroom.id,
  });

  const stream = await renderToStream(
    IPBWAnnual({
      school,
      students: [student],
      classroom,
      disciplines,
      subjects,
      report,
      contacts: [contact],
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
