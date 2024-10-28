"use client";

import { AssignmentSummary } from "./AssignmentSummary";
import { AssignmentTable } from "./AssignmentTable";

export default function Dashboard() {
  return (
    <div className="py-2">
      {/* Summary Cards */}
      <AssignmentSummary />

      {/* Assignments Table */}
      <AssignmentTable />
    </div>
  );
}
