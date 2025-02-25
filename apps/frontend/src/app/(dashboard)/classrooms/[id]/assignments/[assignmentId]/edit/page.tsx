import { notFound } from "next/navigation";

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
  if (!assignment) {
    notFound();
  }
  return (
    <div>
      Edit
      <CreateEditAssignment assignment={assignment} />
    </div>
  );
}
