"use server";

import type { Student } from "@repo/db";

import { api } from "~/trpc/server";

export async function searchStudent(query?: string): Promise<Student[]> {
  const students = await api.student.search({ query: query ?? "" });

  return students;
}
