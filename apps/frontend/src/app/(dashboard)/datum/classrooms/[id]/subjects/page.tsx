import { SubjectDataTable } from "~/components/classrooms/subjects/SubjectDataTable";
import { SubjectHeader } from "~/components/classrooms/subjects/SubjectHeader";

export default function Page() {
  return (
    <div className="flex w-full flex-col">
      <SubjectHeader />
      {/* <SubjectStats subjects={subjects} /> */}
      <SubjectDataTable />
    </div>
  );
}
