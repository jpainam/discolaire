import { AnnouncementDataTable } from "@/components/administration/announcement/AnnouncementDataTable";
import { AnnouncementHeader } from "@/components/administration/announcement/AnnouncementHeader";
import { Separator } from "@repo/ui/separator";

export default async function Page() {
  return (
    <div className="flex w-full flex-col">
      <AnnouncementHeader />
      <Separator />
      <AnnouncementDataTable />
    </div>
  );
}
