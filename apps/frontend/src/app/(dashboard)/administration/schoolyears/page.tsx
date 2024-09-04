import { Separator } from "@repo/ui/separator";

import { SchoolYearHeader } from "~/components/schoolyears/SchoolYearHeader";
import { SchoolYearTable } from "~/components/schoolyears/SchoolYearTable";

export default function Page() {
  return (
    <div className="p4 flex flex-col gap-2 px-4">
      <SchoolYearHeader />
      <Separator />
      <SchoolYearTable />
    </div>
  );
}
