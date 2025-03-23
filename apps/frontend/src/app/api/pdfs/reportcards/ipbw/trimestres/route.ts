import type { NextRequest } from "next/server";
import { z } from "zod";

import { auth } from "@repo/auth";
import { renderToStream } from "@repo/reports";
import { IPBWClassroomTrimestre } from "@repo/reports/reportcards/IPBWClassroomTrimestre";
import { IPBWTrimestre } from "@repo/reports/reportcards/IPBWTrimestre";
import { api, caller } from "~/trpc/server";

const searchSchema = z.object({
  studentId: z.string().nullable(),
  classroomId: z.string().nullable(),
  trimestreId: z.string().min(1),
});
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  const studId = req.nextUrl.searchParams.get("studentId");
  const trimestre = req.nextUrl.searchParams.get("trimestreId");
  const classId = req.nextUrl.searchParams.get("classroomId");

  const result = searchSchema.safeParse({
    studentId: studId,
    trimestreId: trimestre,
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

  const { studentId, trimestreId, classroomId } = result.data;
  if (studentId) {
    return indvidualReportCard({ studentId, trimestreId });
  } else if (classroomId) {
    return classroomReportCard({ classroomId, trimestreId });
  }
}

async function classroomReportCard({
  classroomId,
  trimestreId,
}: {
  classroomId: string;
  trimestreId: string;
}) {
  const school = await api.school.getSchool();
  const students = await api.classroom.students(classroomId);
  const contacts = await api.student.getPrimaryContacts({ classroomId });
  const report = await caller.reportCard.getTrimestre({
    classroomId: classroomId,
    trimestreId: trimestreId,
  });

  const subjects = await api.classroom.subjects(classroomId);
  const classroom = await caller.classroom.get(classroomId);

  const stream = await renderToStream(
    IPBWClassroomTrimestre({
      school,
      students,
      classroom,
      trimestreId,
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
async function indvidualReportCard({
  studentId,
  trimestreId,
}: {
  studentId: string;
  trimestreId: string;
}) {
  const student = await api.student.get(studentId);
  if (!student.classroom) {
    return new Response("Student not registered", { status: 400 });
  }

  const report = await caller.reportCard.getTrimestre({
    classroomId: student.classroom.id,
    trimestreId: trimestreId,
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

  const stream = await renderToStream(
    IPBWTrimestre({
      school,
      student,
      classroom,
      trimestreId,
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
