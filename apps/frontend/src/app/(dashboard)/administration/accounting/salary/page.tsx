import { getTranslations } from "next-intl/server";

import { BreadcrumbsSetter } from "~/components/BreadcrumbsSetter";
import { Separator } from "~/components/ui/separator";
import { SalaryHeader } from "./SalaryHeader";
import { SalaryPayrollTable } from "./SalaryPayrollTable";
import { SalarySummaryCards } from "./SalarySummaryCards";

export default async function Page() {
  const t = await getTranslations();
  return (
    <div className="flex flex-col">
      <BreadcrumbsSetter
        items={[
          { label: t("administration"), href: "/administration" },
          { label: t("Finances"), href: "/administration/accounting" },
          {
            label: t("Salary & Payroll"),
            href: "/administration/accounting/salary",
          },
        ]}
      />
      <SalaryHeader />
      <Separator />
      <SalarySummaryCards />
      <SalaryPayrollTable />
    </div>
  );
}
