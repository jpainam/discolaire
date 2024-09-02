import { Separator } from "@repo/ui/separator";

import { ClassroomLevelChart } from "~/components/administration/classrooms/ClassroomLevelChart";
import { ClassroomLevelEffectif } from "~/components/administration/classrooms/ClassroomLevelEffectif";
import { ClassroomLevelHeader } from "~/components/administration/classrooms/ClassroomLevelHeader";
import { ClassroomLevelTable } from "~/components/administration/classrooms/ClassroomLevelTable";

export default function Page() {
  return (
    <div className="grid grid-cols-1 items-start gap-2 p-4 xl:grid-cols-3">
      <div className="col-span-full">
        <ClassroomLevelHeader />
      </div>
      <Separator className="col-span-full" />
      <ClassroomLevelTable />
      <ClassroomLevelChart />
      <ClassroomLevelEffectif />
    </div>
  );
}
