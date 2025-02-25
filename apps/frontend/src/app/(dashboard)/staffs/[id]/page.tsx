import { TimelineActivity } from "~/components/staffs/timelines/TimelineActivity";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  console.log(params);
  return (
    <div className="flex flex-col p-2">
      <TimelineActivity />
    </div>
  );
}
