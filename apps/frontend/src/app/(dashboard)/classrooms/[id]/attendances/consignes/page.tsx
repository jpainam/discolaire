import { CreateEditConsigne } from "~/components/classrooms/attendances/consignes/CreateEditConsigne";
import { caller } from "~/trpc/server";

export default async function Page(props: {
  searchParams: Promise<{ term: string }>;
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const students = await caller.classroom.students(params.id);
  const termId = searchParams.term;
  const classroomId = params.id;

  return (
    <div className="flex flex-col gap-2 px-2 py-1">
      <CreateEditConsigne
        termId={termId}
        classroomId={classroomId}
        students={students}
      />
    </div>
  );
}
