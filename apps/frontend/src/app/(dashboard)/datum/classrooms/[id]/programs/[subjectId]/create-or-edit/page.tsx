import { CreateEditProgram } from "@/components/classrooms/programs/CreateEditProgram";

export default function Page({
  params: { subjectId },
}: {
  params: { subjectId: number };
}) {
  return (
    <div className="flex flex-col">
      <CreateEditProgram subjectId={subjectId} />
    </div>
  );
}
