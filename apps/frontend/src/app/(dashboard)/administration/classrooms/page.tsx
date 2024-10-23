import { Separator } from "@repo/ui/separator";

import { ClassroomHeader } from "~/components/administration/classrooms/ClassroomHeader";
import ClassroomTable from "~/components/administration/classrooms/ClassroomTable";

export default function Page() {
  return (
    <div className="mx-2 flex flex-col gap-2">
      <ClassroomHeader />
      <Separator />
      <ClassroomTable />
    </div>
  );
}
