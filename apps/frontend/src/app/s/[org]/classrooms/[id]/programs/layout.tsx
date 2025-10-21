import type { SearchParams } from "nuqs/server";
import type React from "react";
import { createLoader, parseAsInteger } from "nuqs/server";

import { ProgramList } from "~/components/classrooms/programs/ProgramList";

const programSchema = {
  subjectId: parseAsInteger,
};
interface PageProps {
  searchParams: Promise<SearchParams>;
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}
const programSearchParamsLoader = createLoader(programSchema);

export default async function Layout(props: PageProps) {
  const params = await props.params;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const searchParams = await programSearchParamsLoader(props.searchParams);
  //const t = await getTranslations();
  // if (!searchParams.subjectId) {
  //   const queryClient = getQueryClient();
  //   const subjects = await queryClient.fetchQuery(
  //     trpc.classroom.subjects.queryOptions(params.id),
  //   );
  //   const subjectId = subjects[0]?.id;
  //   if (!subjectId) {
  //     return <EmptyState title={t("no_data")} />;
  //   }
  //   redirect(`/classrooms/${params.id}/programs?subjectId=${subjectId}`);
  // }

  const { id } = params;

  return (
    <div className="flex h-screen flex-col md:flex-row">
      <ProgramList classroomId={id} />
      <div className="flex-1">{props.children}</div>
    </div>
  );
}
