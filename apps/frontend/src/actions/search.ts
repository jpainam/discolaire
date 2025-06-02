"use server";
import { caller } from "~/trpc/server";

export async function searchStudents({
  q,
  classroomId,
}: {
  q?: string;
  classroomId?: string;
}) {
  return caller.student.search({
    query: q,
    classroomId: classroomId,
    limit: 10,
  });
}
