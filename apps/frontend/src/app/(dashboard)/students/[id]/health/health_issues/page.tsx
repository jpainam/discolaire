import { HealthHistory } from "~/components/students/health/HealthHistory";
import { api } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const issue = await api.health.issues(params.id);
  return (
    <div className="p-4">
      <HealthHistory issue={issue} />
    </div>
  );
}
