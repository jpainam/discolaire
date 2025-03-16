import { CreateEditChatter } from "~/components/classrooms/attendances/chatter/CreateEditChatter";
import { api } from "~/trpc/server";

export default async function Page(props: {
  searchParams: Promise<{ term: number }>;
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const students = await api.classroom.students(params.id);
  const termId = Number(searchParams.term);
  const classroomId = params.id;

  return (
    <div className="flex flex-col gap-2 p-4">
      <CreateEditChatter
        termId={termId}
        classroomId={classroomId}
        students={students}
      />
    </div>
  );
}
