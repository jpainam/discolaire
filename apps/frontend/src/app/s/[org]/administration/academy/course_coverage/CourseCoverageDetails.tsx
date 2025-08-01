"use client";

import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "~/trpc/react";

export function CourseCoverageDetails({ subjectId }: { subjectId: number }) {
  const trpc = useTRPC();
  const coverageQuery = useQuery(
    trpc.subject.getCourseCoverage.queryOptions(subjectId),
  );
  if (coverageQuery.isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex flex-col gap-2">Details of a course coverage</div>
  );
}
