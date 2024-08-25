import { SubjectDataTable } from "@/components/classrooms/subjects/SubjectDataTable";
import { SubjectHeader } from "@/components/classrooms/subjects/SubjectHeader";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  return (
    <div className="flex flex-col w-full">
      <SubjectHeader />
      {/* <SubjectStats subjects={subjects} /> */}
      <SubjectDataTable />
    </div>
  );
}
