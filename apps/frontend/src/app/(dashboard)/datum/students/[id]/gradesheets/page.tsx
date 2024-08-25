import { GradeSheetContent } from "@/components/students/grades/gradesheets/gradesheet-content";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  return <GradeSheetContent studentId={id} />;
}
