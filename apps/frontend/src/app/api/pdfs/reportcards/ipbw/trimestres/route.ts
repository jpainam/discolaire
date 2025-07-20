import type { NextRequest } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import { z } from "zod";

import { getSession } from "~/auth/server";
import { IPBWClassroomTrimestre } from "~/reports/reportcards/IPBWClassroomTrimestre";
import { IPBWTrimestre } from "~/reports/reportcards/IPBWTrimestre";
import { caller } from "~/trpc/server";

const searchSchema = z.object({
  studentId: z.string().nullable(),
  classroomId: z.string().nullable(),
  trimestreId: z.enum(["trim1", "trim2", "trim3"]),
});
export async function GET(req: NextRequest) {
  const session = await getSession();
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
  trimestreId: "trim1" | "trim2" | "trim3";
}) {
  const school = await caller.school.getSchool();
  const students = await caller.classroom.students(classroomId);
  const contacts = await caller.student.getPrimaryContacts({ classroomId });
  const report = await caller.reportCard.getTrimestre({
    classroomId: classroomId,
    trimestreId: trimestreId,
  });

  const subjects = await caller.classroom.subjects(classroomId);
  const classroom = await caller.classroom.get(classroomId);

  const disciplines = await caller.discipline.trimestre({
    classroomId,
    trimestreId,
  });

  const stream = await renderToStream(
    IPBWClassroomTrimestre({
      school,
      students,
      disciplines,
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
  trimestreId: "trim1" | "trim2" | "trim3";
}) {
  const student = await caller.student.get(studentId);
  if (!student.classroom) {
    return new Response("Student not registered", { status: 400 });
  }

  const report = await caller.reportCard.getTrimestre({
    classroomId: student.classroom.id,
    trimestreId: trimestreId,
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

  const disciplines = await caller.discipline.trimestre({
    classroomId: classroom.id,
    trimestreId: trimestreId,
  });

  const stream = await renderToStream(
    IPBWTrimestre({
      school,
      student,
      classroom,
      trimestreId,
      disciplines,
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
