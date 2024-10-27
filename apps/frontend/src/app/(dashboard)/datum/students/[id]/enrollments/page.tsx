import { StudentEnrollmentHeader } from "~/components/students/enrollments/StudentEnrollmentHeader";
import { StudentEnrollmentTable } from "~/components/students/enrollments/StudentEnrollmentTable";
import { api } from "~/trpc/server";

export default async function Page(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;

  const {
    id
  } = params;

  const classroom = await api.student.classroom({ studentId: id });
  const enrollments = await api.student.enrollments(id);

  return (
    <div className="flex flex-col">
      <StudentEnrollmentHeader isEnrolled={classroom !== null} />

      <StudentEnrollmentTable enrollments={enrollments} />
    </div>
  );
}
