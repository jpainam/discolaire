import { PeriodicAttendanceTable } from "~/components/students/attendances/periodic/PeriodicAttendanceTable";

export default function Page({
  params: { id },
  searchParams: { term },
}: {
  params: { id: string };
  searchParams: { term: number };
}) {
  return <PeriodicAttendanceTable studentId={id} term={term} />;
}
