import { EmptyState } from "~/components/EmptyState";
import { getServerTranslations } from "~/i18n/server";

import { ReportCardHeader } from "~/components/students/reportcards/ReportCardHeader";
import { api } from "~/trpc/server";

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;

  const { id } = params;

  const { children } = props;

  const classroom = await api.student.classroom({ studentId: id });
  const { t } = await getServerTranslations();
  if (!classroom) {
    return (
      <EmptyState className="my-8" title={t("student_not_registered_yet")} />
    );
  }
  return (
    <div className="flex w-full gap-2 flex-col">
      <ReportCardHeader classroom={classroom} />
      {children}
    </div>
  );
}
