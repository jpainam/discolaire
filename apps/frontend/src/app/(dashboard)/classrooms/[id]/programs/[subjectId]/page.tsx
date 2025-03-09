import { notFound } from "next/navigation";

import { CreateEditProgram } from "~/components/classrooms/programs/CreateEditProgram";
import { api } from "~/trpc/server";

export default async function Page(props: {
  params: Promise<{ subjectId: string }>;
}) {
  const params = await props.params;

  const { subjectId } = params;

  const subject = await api.subject.get(Number(subjectId));
  if (!subject) {
    notFound();
  }
  return (
    <div className="flex flex-col">
      {/* <ProgramHeader />
      <Separator /> */}
      <CreateEditProgram subjectId={Number(subjectId)} />
      {/* {subject.program ? (
        <div
          className="p-4"
          dangerouslySetInnerHTML={{
            __html: subject.program,
          }}
        />
      ) : (
        <EmptyState title="No Program" className="my-8" />
      )} */}
    </div>
  );
}
