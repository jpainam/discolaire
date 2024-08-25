import { AccessLogsHeader } from "@/components/students/access-logs/AccessLogsHeader";
import { AccessLogsTable } from "@/components/students/access-logs/AccessLogsTable";
import { Separator } from "@repo/ui/separator";

export default function Page() {
  return (
    <div className="flex flex-col">
      <AccessLogsHeader />
      <Separator />
      <AccessLogsTable />
    </div>
  );
}
