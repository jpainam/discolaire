import { auth } from "@repo/auth";
import { decode } from "entities";
import { EducationalResource } from "~/components/dashboard/EducationalResource";
import { QuickStatistics } from "~/components/dashboard/QuickStatistics";
import { ScheduleCard } from "~/components/dashboard/ScheduleCard";
import { SchoolLife } from "~/components/dashboard/SchoolLife";
import { StudentDashboardContact } from "~/components/dashboard/StudentDashboardContact";
import { StudentLatestGrade } from "~/components/dashboard/StudentLatestGrade";
import { api } from "~/trpc/server";

export default async function Page() {
  const session = await auth();
  // logQueue.add("log", {
  //   message: "User logged in",
  //   userId: session?.user.id,
  // });
  if (session?.user.profile === "student") {
    const student = await api.student.getFromUserId(session.user.id);
    return (
      <div className="lg:grid flex flex-col grid-cols-2 gap-4 p-4">
        <StudentLatestGrade
          studentId={student.id}
          name={decode(student.lastName ?? "")}
        />
        <StudentDashboardContact studentId={student.id} />
      </div>
    );
  }
  return (
    <div className="lg:grid flex flex-col grid-cols-2 gap-4 p-4">
      <QuickStatistics className="col-span-full" />
      {/* <SearchBlock className="col-span-full md:col-span-6" /> */}
      <SchoolLife />
      <ScheduleCard />
      <EducationalResource />

      {/* <Suspense>
        <EffectiveStat className="col-span-full" />
      </Suspense> */}
      {/*<ContactCard className="col-span-4" /> */}

      {/* <Suspense>
        <TransactionStat className="col-span-full" />
      </Suspense> */}
      {/* <DashboardClassroomSize className="col-span-full hidden md:block" />
      <DashboardTransactionTrend className="col-span-full hidden md:block" /> */}
    </div>
  );
}
