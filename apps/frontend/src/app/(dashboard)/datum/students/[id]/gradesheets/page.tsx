import { GradeSheetContent } from "~/components/students/grades/gradesheets/gradesheet-content";

export default function Page({ params: { id } }: { params: { id: string } }) {
  return <GradeSheetContent studentId={id} />;
}
