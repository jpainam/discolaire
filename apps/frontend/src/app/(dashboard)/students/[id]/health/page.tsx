import { HealthVisitHeader } from "~/components/students/health/HealthVisitHeader";
import { HealthVisitTable } from "~/components/students/health/HealthVisitTable";
import { api } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const student = await api.student.get(params.id);
  //const { t } = await getServerTranslations();

  return (
    <div className="flex w-full flex-col">
      <HealthVisitHeader userId={student.userId} />

      <HealthVisitTable userId={student.userId ?? "N/A"} />
    </div>
  );
}
