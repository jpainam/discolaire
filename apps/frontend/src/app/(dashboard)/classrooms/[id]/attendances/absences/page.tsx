import { CreateEditAbsence } from "~/components/classrooms/attendances/absence/CreateEditAbsence";
import { caller } from "~/trpc/server";

export default async function Page(props: {
  searchParams: Promise<{ term: number }>;
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const students = await caller.classroom.students(params.id);
  const termId = Number(searchParams.term);
  const classroomId = params.id;

  return (
    <div className="flex flex-col gap-2 px-2 py-1">
      <CreateEditAbsence
        termId={termId}
        classroomId={classroomId}
        students={students}
      />
    </div>
  );
}
