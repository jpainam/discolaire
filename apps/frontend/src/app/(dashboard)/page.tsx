import { auth } from "@repo/auth";
import { decode } from "entities";
import { DashboardClassroomSize } from "~/components/dashboard/DashboardClassroomSize";
import { EducationalResource } from "~/components/dashboard/EducationalResource";
import { LatestGradesheet } from "~/components/dashboard/LatestGradesheet";
import { QuickStatistics } from "~/components/dashboard/QuickStatistics";
import { ScheduleCard } from "~/components/dashboard/ScheduleCard";
import { SchoolLife } from "~/components/dashboard/SchoolLife";
import { Chart01 } from "~/components/dashboard/student/Chart01";
import { StudentGradeTrend } from "~/components/dashboard/student/StudentGradeTrend";
import { StudentDashboardContact } from "~/components/dashboard/StudentDashboardContact";
import { StudentLatestGrade } from "~/components/dashboard/StudentLatestGrade";
import { logQueue } from "~/lib/queue";
import { api, caller } from "~/trpc/server";

export default async function Page() {
  const session = await auth();
  void logQueue.add("log", {
    message: "User logged in",
    userId: session?.user.id,
  });
  if (session?.user.profile === "student") {
    const student = await api.student.getFromUserId(session.user.id);
    const grades = await caller.student.gradeTrends(student.id);
    const subjects = grades.map((grade) => ({
      id: grade.subjectId,
      name: grade.name,
    }));

    return (
      <div className="overflow-hidden grid lg:grid-cols-2 w-full gap-4 p-4">
        <StudentLatestGrade
          studentId={student.id}
          name={decode(student.lastName ?? "")}
        />

        <StudentGradeTrend
          subjects={subjects}
          data={grades.map((g) => {
            return {
              subjectId: g.subjectId,
              maxGrade: g.maxGrade ?? 0,
              grade: g.grade,
            };
          })}
        />
        <Chart01 />

        <StudentDashboardContact studentId={student.id} />
      </div>
    );
  }

  const latestGrades = await caller.gradeSheet.getLatestGradesheet({
    limit: 15,
  });
  const classrooms = await caller.classroom.all();
  return (
    <div className="lg:grid flex flex-col grid-cols-2 gap-4 p-4">
      <QuickStatistics className="col-span-full" />
      {/* <SearchBlock className="col-span-full md:col-span-6" /> */}
      <LatestGradesheet
        grades={latestGrades.map((g) => {
          return {
            name: g.subject.course.shortName,
            max: Math.max(...g.grades.map((grade) => grade.grade)),
            min: Math.min(...g.grades.map((grade) => grade.grade)),
            average: Number(
              (
                g.grades.reduce((acc, grade) => acc + grade.grade, 0) /
                g.grades.length
              ).toFixed(2)
            ),
          };
        })}
      />

      <SchoolLife />
      <ScheduleCard />
      <EducationalResource />

      {/* <EffectiveStat className="col-span-full" />

      <ContactCard className="col-span-4" />

      {/* <Suspense>
        <TransactionStat className="col-span-full" />
      </Suspense> */}
      <DashboardClassroomSize
        classrooms={classrooms}
        className="col-span-full hidden md:block"
      />
      {/* <DashboardTransactionTrend className="col-span-full hidden md:block" /> */}
    </div>
  );
}
