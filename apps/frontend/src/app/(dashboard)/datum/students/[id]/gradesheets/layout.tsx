import { getServerTranslations } from "~/app/i18n/server";
import { EmptyState } from "~/components/EmptyState";
import { api } from "~/trpc/server";

export default async function Layout({
  children,
  params: { id },
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const classroom = await api.student.classroom(id);
  const { t } = await getServerTranslations();
  if (!classroom) {
    return (
      <EmptyState
        className="my-8"
        title={t("no_data")}
        description={t("student_not_registered_yet")}
      />
    );
  }
  return <>{children}</>;
}
