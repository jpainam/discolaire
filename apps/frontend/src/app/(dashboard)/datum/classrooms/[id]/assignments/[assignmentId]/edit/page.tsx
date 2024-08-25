import { CreateEditAssignment } from "@/components/classrooms/assignments/CreateEditAssignment";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";

type EditPageProps = {
  params: {
    id: string;
    assignmentId: string;
  };
};
export default async function Page({ params }: EditPageProps) {
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
