import { SubjectJournalEditor } from "./SubjectJournalEditor";
import { SubjectList } from "./SubjectList";

export default function Page({ params: { id } }: { params: { id: string } }) {
  return (
    <div className="flex h-screen flex-col md:flex-row">
      <SubjectList classroomId={id} />
      <SubjectJournalEditor />
    </div>
  );
}
