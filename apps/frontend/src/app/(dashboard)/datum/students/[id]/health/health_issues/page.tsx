import HealthHistory from "@/components/students/health/HealthHistory";
import { api } from "@/trpc/server";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const studentHistory = await api.health.issues();
  return <HealthHistory history={studentHistory} />;
}
