import FlatBadge from "~/components/FlatBadge";
import { getServerTranslations } from "~/i18n/server";

import { DeletedTransactionDataTable } from "~/components/administration/transactions/DeletedDataTable";
import { api } from "~/trpc/server";

export default async function Page(props: {
  searchParams: Promise<{
    from?: string;
    to?: string;
    status?: string;
    classroom?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const { t, i18n } = await getServerTranslations();
  const school = await api.school.getSchool();
  const transactions = await api.transaction.getDeleted({
    status: searchParams.status,
    from: searchParams.from ? new Date(searchParams.from) : undefined,
    to: searchParams.to ? new Date(searchParams.to) : undefined,
    classroom: searchParams.classroom,
  });

  const totals = transactions.reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="flex flex-col px-4">
      <div className="grid flex-row items-center gap-4 py-2 md:flex">
        <FlatBadge variant={"green"}>
          {t("totals")} :{" "}
          {totals.toLocaleString(i18n.language, {
            style: "currency",
            currency: school.currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
        </FlatBadge>
        <FlatBadge variant={"red"}>
          {t("deleted")} : {transactions.length}
        </FlatBadge>
      </div>
      <DeletedTransactionDataTable transactions={transactions} />
    </div>
  );
}
