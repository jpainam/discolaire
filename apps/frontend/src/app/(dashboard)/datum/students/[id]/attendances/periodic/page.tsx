import { PeriodicAttendanceTable } from "~/components/students/attendances/periodic/PeriodicAttendanceTable";

export default async function Page(
  props: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ term: number }>;
  }
) {
  const searchParams = await props.searchParams;

  const {
    term
  } = searchParams;

  const params = await props.params;

  const {
    id
  } = params;

  return <PeriodicAttendanceTable studentId={id} term={term} />;
}
