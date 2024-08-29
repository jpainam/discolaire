import { ClassroomFeeHeader } from "~/components/classrooms/fees/ClassroomFeeHeader";
import { ClassroomFeeTable } from "~/components/classrooms/fees/ClassroomFeeTable";

export default function Page({ params: { id } }: { params: { id: string } }) {
  return (
    <div className="flex w-full flex-col gap-2">
      <ClassroomFeeHeader />
      <ClassroomFeeTable classroomId={id} />
    </div>
  );
}
