import { EmptyState } from "~/components/EmptyState";
import { getServerTranslations } from "~/i18n/server";

import { caller } from "~/trpc/server";
import { StudentGradesheetHeader } from "./StudentGradesheetHeader";

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;

  const { id } = params;

  const { children } = props;

  const classroom = await caller.student.classroom({ studentId: id });
  const { t } = await getServerTranslations();
  if (!classroom) {
    return (
      <EmptyState className="my-8" title={t("student_not_registered_yet")} />
    );
  }
  return (
    <div className="flex flex-col gap-2">
      <StudentGradesheetHeader />
      {children}
    </div>
  );
}
