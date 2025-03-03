import { EmptyState } from "~/components/EmptyState";
import { getServerTranslations } from "~/i18n/server";

import { api } from "~/trpc/server";
import { PrintAction } from "./PrintAction";
import { TransactionTabMenu } from "./TransactionTabMenu";

export default async function Layout(props: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
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
    <div className="flex gap-2 flex-col">
      <div className="flex flex-row items-center justify-between border-b py-1 px-4">
        <TransactionTabMenu />
        <PrintAction />
      </div>
      {children}
    </div>
  );
}
