import { HealthVisitHeader } from "~/components/students/health/HealthVisitHeader";
import { HealthVisitTable } from "~/components/students/health/HealthVisitTable";
import { caller } from "~/trpc/server";
import { getFullName } from "~/utils";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const student = await caller.student.get(params.id);
  //const { t } = await getServerTranslations();

  return (
    <div className="flex w-full flex-col">
      <HealthVisitHeader userId={student.userId} />

      <HealthVisitTable
        name={getFullName(student)}
        userId={student.userId ?? "N/A"}
      />
    </div>
  );
}
