import { getTranslations } from "next-intl/server";

import { BreadcrumbsSetter } from "~/components/BreadcrumbsSetter";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";
import { SalaryDetailView } from "./SalaryDetailView";

export default async function Page(props: {
  params: Promise<{ salaryId: string }>;
}) {
  const { salaryId } = await props.params;
  const t = await getTranslations();

  batchPrefetch([trpc.payroll.get.queryOptions(salaryId)]);

  return (
    <HydrateClient>
      <BreadcrumbsSetter
        items={[
          { label: t("administration"), href: "/administration" },
          { label: t("Finances"), href: "/administration/accounting" },
          {
            label: t("Salary & Payroll"),
            href: "/administration/accounting/salary",
          },
          { label: salaryId },
        ]}
      />
      <SalaryDetailView salaryId={salaryId} />
    </HydrateClient>
  );
}
