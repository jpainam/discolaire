import { caller } from "~/trpc/server";
import { SubjectList } from "./SubjectList";

export default async function Layout(props: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) {
  const params = await props.params;

  const { id } = params;
  const subjects = await caller.classroom.subjects(id);

  const { children } = props;

  return (
    <div className="flex h-screen flex-col md:flex-row">
      <SubjectList subjects={subjects} classroomId={id} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
