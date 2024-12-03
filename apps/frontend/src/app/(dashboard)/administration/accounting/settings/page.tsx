import { api } from "~/trpc/server";
import { CanReceiveTransactionSummary } from "./CanReceiveTransactionSummary";

export default async function Page() {
  const staffs = await api.staff.all();
  return (
    <div className="grid md:grid-cols-2">
      <CanReceiveTransactionSummary staffs={staffs} />
    </div>
  );
}
