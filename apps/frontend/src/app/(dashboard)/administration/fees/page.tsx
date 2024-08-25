import { Separator } from "@repo/ui/separator";

import { FeeBar } from "~/components/administration/fees/charts/FeeBar";
import { FeeTrend } from "~/components/administration/fees/charts/FeeTrend";
import { FeeDataTable } from "~/components/administration/fees/FeeDataTable";
import { FeeHeader } from "~/components/administration/fees/FeeHeader";

export default function Page({
  searchParams: { classroom, status },
}: {
  searchParams: { classroom: string; status: string };
}) {
  return (
    <div className="flex flex-col">
      <FeeHeader />
      <Separator />
      <div className="flex flex-row px-2">
        <div className="flex-1">
          <FeeDataTable />
        </div>
        <FeeBar />
      </div>
      <FeeTrend />
    </div>
  );
}
