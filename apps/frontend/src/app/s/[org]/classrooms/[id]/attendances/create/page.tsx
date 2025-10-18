import { createLoader, SearchParams } from "nuqs/server";

import { attendanceSearchSchema } from "../query-params";
import { CreateClassroomAttendance } from "./CreateClassroomAttendance";

interface PageProps {
  searchParams: Promise<SearchParams>;
  params: Promise<{ id: string }>;
}

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
