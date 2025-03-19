import { api } from "~/trpc/server";
import { DrugHeader } from "./DrugHeader";
import { DrugTable } from "./DrugTable";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const drugs = await api.health.drugs({ studentId: params.id });
  return (
    <div className="flex flex-col">
      <DrugHeader />
      <DrugTable drugs={drugs} />
    </div>
  );
}
