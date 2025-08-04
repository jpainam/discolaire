"use client";

import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "~/trpc/react";

export function StudentAttendanceDetails({
  type,
  id,
}: {
  id: number;
  type: "absence" | "chatter" | "consigne" | "exclusion" | "lateness";
}) {
  const trpc = useTRPC();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const attendanceQuery = useQuery(
    trpc.attendance.get.queryOptions({
      id: id,
      type: type,
    }),
  );
  return <div>The student attendance details</div>;
}
