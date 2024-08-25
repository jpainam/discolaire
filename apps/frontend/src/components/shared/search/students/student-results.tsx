"use client";

import { useSearchParams } from "next/navigation";
import { StudentsTable } from "./students-table";

export function StudentResults() {
  const searchParams = useSearchParams();

  return (
    <div>
      <StudentsTable />
    </div>
  );
}
