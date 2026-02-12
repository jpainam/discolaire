import { LogActivityList } from "~/components/log-activities/LogActivityList";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const staffId = params.id;
  return <LogActivityList entityId={staffId} entityType="staff" />;
}
