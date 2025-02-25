import { Separator } from "@repo/ui/components/separator";

import { AnnouncementDataTable } from "~/components/administration/announcement/AnnouncementDataTable";
import { AnnouncementHeader } from "~/components/administration/announcement/AnnouncementHeader";

export default function Page() {
  return (
    <div className="flex w-full flex-col">
      <AnnouncementHeader />
      <Separator />
      <AnnouncementDataTable />
    </div>
  );
}
