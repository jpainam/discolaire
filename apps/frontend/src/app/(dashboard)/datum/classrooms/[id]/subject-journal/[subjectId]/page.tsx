import { SubjectJournalEditor } from "./SubjectJournalEditor";
import { SubjectJournalList } from "./SubjectJournalList";

export default function Page({
  params: { subjectId },
}: {
  params: { subjectId: string };
}) {
  return (
    <div>
      <SubjectJournalEditor subjectId={Number(subjectId)} />
      <SubjectJournalList subjectId={Number(subjectId)} />
    </div>
  );
}
