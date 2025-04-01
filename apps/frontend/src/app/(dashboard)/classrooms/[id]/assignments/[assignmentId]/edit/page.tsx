import { CreateEditAssignment } from "~/components/classrooms/assignments/CreateEditAssignment";
import { api } from "~/trpc/server";

interface EditPageProps {
  params: Promise<{
    id: string;
    assignmentId: string;
  }>;
}
export default async function Page(props: EditPageProps) {
  const params = await props.params;
  const assignment = await api.assignment.get(params.assignmentId);

  return (
    <div>
      Edit
      <CreateEditAssignment assignment={assignment} />
    </div>
  );
}
