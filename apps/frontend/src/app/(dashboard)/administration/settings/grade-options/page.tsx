import { api } from "~/trpc/server";
import { GradeAppreciationTable } from "./GradeAppreciationTable";

export default async function Page() {
  const classrooms = await api.classroom.all();
  return (
    <div className="grid gap-2 p-2 lg:grid-cols-2">
      <GradeAppreciationTable classrooms={classrooms} />
    </div>
  );
}
