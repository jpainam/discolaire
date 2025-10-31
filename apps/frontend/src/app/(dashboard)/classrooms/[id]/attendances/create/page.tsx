import type { SearchParams } from "nuqs/server";
import { createLoader, parseAsString } from "nuqs/server";

import { CreateClassroomAttendance } from "./CreateClassroomAttendance";

interface PageProps {
  searchParams: Promise<SearchParams>;
  params: Promise<{ id: string }>;
}
const attendanceSearchSchema = {
  termId: parseAsString,
};
const attendanceSearchParams = createLoader(attendanceSearchSchema);
export default async function Page(props: PageProps) {
  const params = await props.params;
  const searchParams = await attendanceSearchParams(props.searchParams);

  return (
    <div>
      {searchParams.termId && (
        <CreateClassroomAttendance
          classroomId={params.id}
          termId={searchParams.termId}
        />
      )}
    </div>
  );
}
