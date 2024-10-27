import { CreateEditProgram } from "~/components/classrooms/programs/CreateEditProgram";

export default async function Page(
  props: {
    params: Promise<{ subjectId: number }>;
  }
) {
  const params = await props.params;

  const {
    subjectId
  } = params;

  return (
    <div className="flex flex-col">
      <CreateEditProgram subjectId={subjectId} />
    </div>
  );
}
