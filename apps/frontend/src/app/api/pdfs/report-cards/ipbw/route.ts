import type { NextRequest } from "next/server";
import { z } from "zod";

import { api } from "~/trpc/server";

const searchSchema = z.object({
  studentId: z.string().min(1),
  classroomId: z.string().min(1),
});
export async function GET(req: NextRequest) {
  const studId = req.nextUrl.searchParams.get("studentId");
  const classId = req.nextUrl.searchParams.get("classroomId");
  const result = searchSchema.safeParse({
    classroomId: classId,
    studentId: studId,
  });
  if (!result.success) {
    return new Response("Not yet implemetend", { status: 500 });
  }
  const { studentId, classroomId } = result.data;
  const student = await api.student.get(studentId);
  console.log(student);
  console.log(classroomId);

  return new Response("Implemeting", { status: 500 });
}
