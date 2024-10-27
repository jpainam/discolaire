import { notFound } from "next/navigation";

import { Separator } from "@repo/ui/separator";

import { api } from "~/trpc/server";
import { SubjectJournalEditor } from "./SubjectJournalEditor";
import { SubjectJournalHeader } from "./SubjectJournalHeader";
import { SubjectJournalList } from "./SubjectJournalList";

export default async function Page(
  props: {
    params: Promise<{ subjectId: string }>;
  }
) {
  const params = await props.params;

  const {
    subjectId
  } = params;

  const subject = await api.subject.get({ id: Number(subjectId) });
  if (!subject) {
    notFound();
  }
  return (
    <div className="flex flex-col">
      <SubjectJournalHeader
        subject={{ name: subject.course.name, id: subject.id }}
      />
      <SubjectJournalEditor subjectId={Number(subjectId)} />
      <Separator />
      <SubjectJournalList subjectId={Number(subjectId)} />
    </div>
  );
}
