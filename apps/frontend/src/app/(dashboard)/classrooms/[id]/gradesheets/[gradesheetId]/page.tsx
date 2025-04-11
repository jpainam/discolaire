import { auth } from "@repo/auth";
import { GradeDataTable } from "~/components/classrooms/gradesheets/grades/GradeDataTable";
import { GradeDetailsHeader } from "~/components/classrooms/gradesheets/grades/GradeDetailsHeader";
import { caller } from "~/trpc/server";

export default async function Page(props: {
  params: Promise<{ gradesheetId: number }>;
}) {
  const params = await props.params;

  const { gradesheetId } = params;
  const session = await auth();
  const gradesheet = await caller.gradeSheet.get(Number(gradesheetId));

  let grades = await caller.gradeSheet.grades(Number(gradesheetId));
  const allGrades = [...grades];

  if (session?.user.profile === "student") {
    const student = await caller.student.getFromUserId(session.user.id);
    grades = grades.filter((g) => g.studentId === student.id);
  } else if (session?.user.profile === "contact") {
    const contact = await caller.contact.getFromUserId(session.user.id);
    const students = await caller.contact.students(contact.id);
    const studentIds = students.map((s) => s.studentId);
    grades = grades.filter((g) => studentIds.includes(g.studentId));
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <GradeDetailsHeader gradesheet={gradesheet} grades={allGrades} />
      <GradeDataTable grades={grades} />
    </div>
  );
}
