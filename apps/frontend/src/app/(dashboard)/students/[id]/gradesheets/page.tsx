import { GradeSheetContent } from "~/components/students/grades/gradesheets/gradesheet-content";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const { id } = params;

  return <GradeSheetContent studentId={id} />;
}
