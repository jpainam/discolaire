import { StudentsTable } from "@/components/administration/students/students-table";
import { StudentsToolbar } from "@/components/administration/students/students-toolbar";
import { Separator } from "@repo/ui/separator";

export default function StudentsContent() {
  return (
    <div className="flex h-full flex-col">
      <StudentsToolbar />
      <Separator />
      <div className="flex flex-1 flex-col px-2">
        <StudentsTable />
      </div>
    </div>
  );
}
