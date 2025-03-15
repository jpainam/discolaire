// import { FeeBar } from "~/components/administration/fees/charts/FeeBar";
// import { FeeTrend } from "~/components/administration/fees/charts/FeeTrend";
import { FeeDataTable } from "~/components/administration/fees/FeeDataTable";
import { FeeHeader } from "~/components/administration/fees/FeeHeader";
import { api } from "~/trpc/server";

export default async function Page() {
  const fees = await api.fee.all();
  return (
    <div className="flex flex-col gap-2">
      <FeeHeader />
      <FeeDataTable fees={fees} />
      {/* <div className="flex flex-row gap-2">
        <FeeBar />
        <FeeTrend />
      </div> */}
    </div>
  );
}
