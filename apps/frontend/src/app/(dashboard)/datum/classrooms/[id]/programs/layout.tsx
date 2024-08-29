import { ProgramList } from "~/components/classrooms/programs/ProgramList";

export default function Layout({
  children,
  params: { id },
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  //const subjects = await api.classroom.subjects({ id });

  return (
    <div className="flex w-full flex-row">
      <ProgramList classroomId={id} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
