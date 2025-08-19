import { AssignmentHeader } from "~/components/classrooms/assignments/AssignmentHeader";
import { AssignmentList } from "./AssignmentList";

interface AssignmentPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{ termId?: string; from?: string; to?: string }>;
}
export default async function Page(props: AssignmentPageProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const params = await props.params;
  //const assignemts = await caller.classroom.assignments(params.id);
  //const subjects = await caller.classroom.subjects(params.id);
  return (
    <div className="flex flex-col">
      <AssignmentHeader />
      <AssignmentList />
    </div>
  );
}
