import { AssignmentDataTable } from "~/components/classrooms/assignments/AssignmentDataTable";
import { AssignmentHeader } from "~/components/classrooms/assignments/AssignmentHeader";
import { caller } from "~/trpc/server";

interface AssignmentPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{ termId?: string; from?: string; to?: string }>;
}
export default async function Page(props: AssignmentPageProps) {
  const params = await props.params;
  const assignemts = await caller.classroom.assignments(params.id);
  return (
    <div className="flex flex-col gap-2">
      <AssignmentHeader />
      <div className="px-4">
        <AssignmentDataTable assignments={assignemts} />
      </div>
    </div>
  );
}
