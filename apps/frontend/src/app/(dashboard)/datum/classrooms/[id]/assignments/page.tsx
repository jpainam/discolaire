import { AssignmentDataTable } from "~/components/classrooms/assignments/AssignmentDataTable";
import { AssignmentHeader } from "~/components/classrooms/assignments/AssignmentHeader";
import { api } from "~/trpc/server";

interface AssignmentPageProps {
  params: {
    id: string;
  };
}
export default async function Page({ params }: AssignmentPageProps) {
  const assignemts = await api.classroom.assignments(params.id);
  return (
    <div className="flex flex-col">
      <AssignmentHeader />
      <AssignmentDataTable assignments={assignemts} />
    </div>
  );
}
