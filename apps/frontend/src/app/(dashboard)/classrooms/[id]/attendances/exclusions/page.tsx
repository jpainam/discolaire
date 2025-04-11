import { CreateEditExclusion } from "~/components/classrooms/attendances/exclusions/CreateEditExclusion";
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
    <div className="flex flex-col gap-2 p-4">
      <CreateEditExclusion
        termId={termId}
        classroomId={classroomId}
        students={students}
      />
    </div>
  );
}
