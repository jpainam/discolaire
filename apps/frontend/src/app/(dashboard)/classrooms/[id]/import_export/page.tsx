import { getQueryClient, trpc } from "~/trpc/server";
import { ImportExportCreateGradesheet } from "./ImportExportCreateGradesheet";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const queryClient = getQueryClient();
  const params = await props.params;
  const students = await queryClient.fetchQuery(
    trpc.classroom.students.queryOptions(params.id),
  );
  const classroom = await queryClient.fetchQuery(
    trpc.classroom.get.queryOptions(params.id),
  );
  return (
    <div className="grid grid-cols-1 px-4 py-4 md:grid-cols-4">
      <ImportExportCreateGradesheet students={students} classroom={classroom} />
    </div>
  );
}
