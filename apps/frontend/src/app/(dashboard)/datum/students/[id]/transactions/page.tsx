import { getServerTranslations } from "@repo/i18n/server";
import { Separator } from "@repo/ui/separator";

import FinanceHeader from "~/components/students/transactions/FinanceHeader";
import { TransactionStats } from "~/components/students/transactions/transaction-stats";
import { TransactionDataTable } from "~/components/students/transactions/TransactionDataTable";
import { api } from "~/trpc/server";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const { t } = await getServerTranslations();
  const classroom = await api.student.classroom(id);
  const transactions = await api.student.transactions(id);

  return (
    <div className="flex w-full flex-col gap-0">
      <FinanceHeader />
      <Separator />
      {classroom && (
        <TransactionStats
          classroomId={classroom.id}
          transactions={transactions}
        />
      )}
      <TransactionDataTable
        count={transactions.length}
        transactions={transactions}
      />
    </div>
  );
}
