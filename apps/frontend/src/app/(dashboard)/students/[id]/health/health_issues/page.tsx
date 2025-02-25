import HealthHistory from "~/components/students/health/HealthHistory";
import { api } from "~/trpc/server";

export default async function Page() {
  const studentHistory = await api.health.issues();
  return <HealthHistory history={studentHistory} />;
}
