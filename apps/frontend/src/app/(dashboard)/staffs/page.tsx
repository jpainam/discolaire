import { Separator } from "@repo/ui/components/separator";

import { StaffDataTable } from "~/components/staffs/StaffDataTable";
import { StaffHeader } from "~/components/staffs/StaffHeader";
import { api } from "~/trpc/server";

export default async function Page() {
  const staffs = await api.staff.all();
  return (
    <div className="flex flex-col">
      <StaffHeader staffs={staffs} />

      <Separator />
      <div className="mt-2 flex-1 px-4">
        <StaffDataTable staffs={staffs} />
      </div>
    </div>
  );
}
