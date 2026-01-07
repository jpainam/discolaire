"use server";

import { getSession } from "~/auth/server";
import { caller } from "~/trpc/server";

export async function hasPreviousGradesheet({
  termId,
  subjectId,
}: {
  termId: string;
  subjectId: number;
}) {
  const session = await getSession();
  if (!session) {
    throw new Error("Not authenticated");
  }
  const previousGradesheet = await caller.gradeSheet.all({
    termId,
    subjectId,
  });

  return previousGradesheet.length > 0;
}
