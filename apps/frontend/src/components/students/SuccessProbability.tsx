"use client";

import FlatBadge from "../FlatBadge";
export function SuccessProbability({ studentId }: { studentId: string }) {
  console.log("studentId", studentId);

  return <FlatBadge variant={"pink"}>50%</FlatBadge>;
}
