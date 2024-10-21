import { notFound } from "next/navigation";

import { CreateEditProgram } from "~/components/classrooms/programs/CreateEditProgram";
import { api } from "~/trpc/server";

export default async function Page({
  params: { subjectId },
}: {
  params: { subjectId: string };
}) {
  const subject = await api.subject.get({ id: Number(subjectId) });
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
