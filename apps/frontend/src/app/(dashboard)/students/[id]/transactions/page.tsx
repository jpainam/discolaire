import { EmptyState } from "~/components/EmptyState";
import { getServerTranslations } from "~/i18n/server";

//import FinanceHeader from "~/components/students/transactions/FinanceHeader";
import { TransactionStats } from "~/components/students/transactions/transaction-stats";
import { TransactionTable } from "~/components/students/transactions/TransactionTable";
import { api } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const { id } = params;

  const classroom = await api.student.classroom({ studentId: id });
  const transactions = await api.student.transactions(id);
  const { t } = await getServerTranslations();

  return (
    <div className="flex w-full flex-col gap-0">
      {/* <FinanceHeader />
      <Separator /> */}

      {classroom && (
        <TransactionStats
          classroomId={classroom.id}
          transactions={transactions}
        />
      )}
      {classroom ? (
        <TransactionTable />
      ) : (
        <EmptyState className="my-8" title={t("student_not_registered_yet")} />
      )}
    </div>
  );
}
