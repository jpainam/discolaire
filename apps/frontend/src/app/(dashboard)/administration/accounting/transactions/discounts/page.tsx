import FlatBadge from "~/components/FlatBadge";
import { getServerTranslations } from "~/i18n/server";

import { DiscountDataTable } from "~/components/administration/transactions/DiscountDataTable";
import { CURRENCY } from "~/lib/constants";
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
  //const school = await api.school.getSchool();
  const transactions = await api.transaction.all({
    status: searchParams.status,
    from: searchParams.from ? new Date(searchParams.from) : undefined,
    to: searchParams.to ? new Date(searchParams.to) : undefined,
    classroomId: searchParams.classroom,
    transactionType: "DISCOUNT",
  });

  const moneyFormatter = new Intl.NumberFormat(i18n.language, {
    style: "currency",
    currency: CURRENCY,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });

  const totals = transactions.reduce((acc, curr) => acc + curr.amount, 0);
  const validated = transactions.reduce(
    (acc, curr) => acc + (curr.status == "VALIDATED" ? curr.amount : 0),
    0
  );
  const canceled = transactions.reduce(
    (acc, curr) => acc + (curr.status == "CANCELED" ? curr.amount : 0),
    0
  );
  const pending = transactions.reduce(
    (acc, curr) => acc + (curr.status == "PENDING" ? curr.amount : 0),
    0
  );

  return (
    <div className="flex flex-col px-4">
      <div className="grid flex-row items-center gap-4 py-2 md:flex">
        <FlatBadge variant={"indigo"}>
          {t("totals")} : {moneyFormatter.format(totals)}
        </FlatBadge>
        <FlatBadge variant={"green"}>
          {t("validated")} : {moneyFormatter.format(validated)}
        </FlatBadge>
        <FlatBadge variant={"blue"}>
          {t("pending")} : {moneyFormatter.format(pending)}
        </FlatBadge>
        <FlatBadge variant={"red"}>
          {t("canceled")} : {moneyFormatter.format(canceled)}
        </FlatBadge>
      </div>
      <DiscountDataTable transactions={transactions} />
    </div>
  );
}
