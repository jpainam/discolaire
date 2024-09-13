import { notFound } from "next/navigation";

import { EmptyState } from "@repo/ui/EmptyState";
import { Separator } from "@repo/ui/separator";

import { ProgramHeader } from "~/components/classrooms/programs/ProgramHeader";
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
      <ProgramHeader />
      <Separator />
      {subject.program ? (
        <div
          className="p-4"
          dangerouslySetInnerHTML={{
            __html: subject.program,
          }}
        />
      ) : (
        <EmptyState title="No Program" className="my-8" />
      )}
    </div>
  );
}
