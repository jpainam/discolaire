import { caller } from "~/trpc/server";

export default async function Page(props: {
  params: Promise<{ id: string; healthId: string }>;
}) {
  const params = await props.params;
  const visit = await caller.health.getVisit(params.healthId);
  console.log(visit);
  return <div>Edit healtp hage</div>;
}
