import { ClassroomLevelChart } from "~/components/administration/classrooms/ClassroomLevelChart";
import { ClassroomLevelEffectif } from "~/components/administration/classrooms/ClassroomLevelEffectif";
import { ClassroomLevelHeader } from "~/components/administration/classrooms/ClassroomLevelHeader";
import { ClassroomLevelTable } from "~/components/administration/classrooms/ClassroomLevelTable";

export default function Page() {
  return (
    <div className="grid grid-cols-1 items-start gap-2 xl:grid-cols-2">
      <ClassroomLevelHeader />
      <ClassroomLevelTable />
      <div className="flex flex-col gap-2">
        <ClassroomLevelChart />
        <ClassroomLevelEffectif />
      </div>
    </div>
  );
}
