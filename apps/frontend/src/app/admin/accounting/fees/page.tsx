import { Separator } from "@repo/ui/separator";

import { FeeBar } from "~/components/administration/fees/charts/FeeBar";
import { FeeTrend } from "~/components/administration/fees/charts/FeeTrend";
import { FeeDataTable } from "~/components/administration/fees/FeeDataTable";
import { FeeHeader } from "~/components/administration/fees/FeeHeader";

export default function Page() {
  return (
    <div className="flex flex-col">
      <FeeHeader />
      <Separator />

      <FeeDataTable />

      <div className="flex flex-row gap-2">
        <FeeBar />
        <FeeTrend />
      </div>
    </div>
  );
}
