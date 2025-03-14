import { auth } from "@repo/auth";
import { redirect } from "next/navigation";
import { ClassroomDataTable } from "~/components/classrooms/ClassroomDataTable";
import { EmptyState } from "~/components/EmptyState";
import { getServerTranslations } from "~/i18n/server";
import { api } from "~/trpc/server";

export default async function Page() {
  const session = await auth();
  const { t } = await getServerTranslations();
  if (session?.user.profile === "student") {
    const student = await api.student.getFromUserId(session.user.id);
    const classroom = await api.student.classroom({ studentId: student.id });
    if (!classroom) {
      return (
        <EmptyState
          className="my-8 self-start"
          title={t("student_not_registered_yet")}
        />
      );
    }
    redirect(`/classrooms/${classroom.id}`);
  }
  const classrooms = await api.classroom.all();
  return <ClassroomDataTable classrooms={classrooms} />;
}
