import { caller } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  await caller.logActivity.create({
    title: "Student contacts",
    type: "READ",
    url: `/students/${params.id}/contacts`,
    entityId: params.id,
    entityType: "student",
  });
  return <></>;
}
