import { LogActivityTable } from "~/components/LogActivityTable";
import { caller } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const logs = await caller.logActivity.all();
  console.log(params);
  return (
    <div className="flex flex-col p-2">
      {/* <TimelineActivity /> */}
      <LogActivityTable logs={logs} />
    </div>
  );
}
