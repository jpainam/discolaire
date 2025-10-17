import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import {
  createLoader,
  parseAsIsoDate,
  parseAsString,
  parseAsStringLiteral,
  SearchParams,
} from "nuqs/server";

import { AttendanceHeader } from "~/components/classrooms/attendances/AttendanceHeader";
import { ErrorFallback } from "~/components/error-fallback";
import { HydrateClient } from "~/trpc/server";
import { CreateDailyAttendance } from "./CreateDailyAttendance";
import { CreatePeriodicAttendance } from "./CreatePeriodicAttendance";
import { DailyAttendanceList } from "./DailyAttendanceList";
import { PeriodicAttendanceList } from "./PeriodicAttendanceList";

const attendanceSearchSchema = {
  termId: parseAsString,
  attendanceType: parseAsStringLiteral(["daily", "periodic"]),
  date: parseAsIsoDate.withDefault(new Date()),
};
interface PageProps {
  searchParams: Promise<SearchParams>;
  params: Promise<{ id: string }>;
}

const attendanceSearchParams = createLoader(attendanceSearchSchema);

export default async function Page(props: PageProps) {
  const searchParams = await attendanceSearchParams(props.searchParams);
  const params = await props.params;
  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <AttendanceHeader />
      </ErrorBoundary>
      {!searchParams.termId && !searchParams.attendanceType && (
        <div className="grid grid-cols-2 gap-4 px-4">
          <DailyAttendanceList />
          <PeriodicAttendanceList />
        </div>
      )}
      {searchParams.termId && searchParams.attendanceType === "periodic" && (
        <CreatePeriodicAttendance
          classroomId={params.id}
          termId={searchParams.termId}
        />
      )}
      {searchParams.date && searchParams.attendanceType == "daily" && (
        <CreateDailyAttendance classroomId={params.id} date={searchParams.date} />
      )}
    </HydrateClient>
  );
}
