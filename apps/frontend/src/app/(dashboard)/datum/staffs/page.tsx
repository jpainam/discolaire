import { Suspense } from "react";

import { Separator } from "@repo/ui/components/separator";
import { DataTableSkeleton } from "@repo/ui/datatable/data-table-skeleton";

import { StaffDataTable } from "~/components/staffs/StaffDataTable";
import { StaffHeader } from "~/components/staffs/StaffHeader";

export default function Page() {
  return (
    <div className="flex flex-col px-2">
      <Suspense key={"staff-header-suspense"}>
        <StaffHeader />
      </Suspense>

      <Separator />
      <div className="mt-2 flex-1">
        {/* <StaffGrid staffs={staffs} /> */}
        <Suspense
          key={"staff-data-table-suspense"}
          fallback={
            <DataTableSkeleton
              columnCount={5}
              searchableColumnCount={1}
              filterableColumnCount={2}
              cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem"]}
              shrinkZero
            />
          }
        >
          <StaffDataTable />
        </Suspense>
      </div>
    </div>
  );
}
