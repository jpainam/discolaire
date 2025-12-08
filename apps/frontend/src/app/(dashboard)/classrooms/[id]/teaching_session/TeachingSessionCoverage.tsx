"use client";

import { parseAsInteger, useQueryState } from "nuqs";

import { SubjectSessionBoard } from "~/components/classrooms/subjects/SubjectSessionBoard";

export function TeachingSessionCoverage({
  defaultSubjectId,
}: {
  defaultSubjectId: number;
}) {
  const [subjectId] = useQueryState(
    "subjectId",
    parseAsInteger.withDefault(defaultSubjectId),
  );

  return (
    <SubjectSessionBoard
      className="grid grid-cols-3 gap-4 px-4 py-2"
      subjectId={subjectId}
    />
  );
}
