import { schedules } from "@repo/jobs";

import { CanReceiveTransactionSummary } from "./CanReceiveTransactionSummary";

export default async function Page() {
  const { timezones } = await schedules.timezones();
  return (
    <div className="grid md:grid-cols-2">
      <CanReceiveTransactionSummary timezones={timezones} />
    </div>
  );
}
