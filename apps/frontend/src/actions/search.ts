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

export async function searchContacts({ q }: { q?: string }) {
  return caller.contact.search({
    query: q,
    limit: 10,
  });
}
