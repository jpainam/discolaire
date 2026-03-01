import { LogActivityList } from "~/components/log-activities/LogActivityList";
import { getQueryClient, trpc } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const staffId = params.id;
  const queryClient = getQueryClient();
  const staff = await queryClient.fetchQuery(
    trpc.staff.get.queryOptions(staffId),
  );
  void staff;
  return <LogActivityList entityId={staffId} entityType="staff" />;
}
