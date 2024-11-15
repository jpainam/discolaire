import { schedules } from "@repo/jobs";

import { CanReceiveTransactionSummary } from "./CanReceiveTransactionSummary";

export default async function Page() {
  const { timezones } = await schedules.timezones();
  return (
    <div className="grid p-4 md:grid-cols-2">
      <CanReceiveTransactionSummary timezones={timezones} />
    </div>
  );
}
