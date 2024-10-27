import { notFound } from "next/navigation";

import { TimelineActivity } from "~/components/staffs/timelines/TimelineActivity";
import { api } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const { id } = params;

  const staff = await api.staff.get(id);
  if (!staff) {
    notFound();
  }

  return (
    <div className="flex flex-col p-2">
      <TimelineActivity />
    </div>
  );
}
