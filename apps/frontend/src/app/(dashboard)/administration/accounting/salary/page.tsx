import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";

import { BreadcrumbsSetter } from "~/components/BreadcrumbsSetter";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";
import { payrollSearchParams } from "~/utils/search-params";
import { SalaryHeader } from "./SalaryHeader";
import { SalaryPayrollTable } from "./SalaryPayrollTable";
import { SalarySummaryCards } from "./SalarySummaryCards";

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function Page(props: PageProps) {
  const t = await getTranslations();
  const params = await payrollSearchParams(props.searchParams);

  batchPrefetch([
    trpc.staff.all.queryOptions({ limit: 300 }),
    trpc.payroll.all.queryOptions({
      limit: 20,
      query: params.query ?? undefined,
      status: params.status ?? undefined,
      period: params.period ? new Date(params.period) : undefined,
    }),
  ]);

  return (
    <HydrateClient>
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
        <Suspense
          fallback={
            <div className="px-4 pt-4">
              <div className="grid gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </div>
          }
        >
          <SalaryPayrollTable />
        </Suspense>
      </div>
    </HydrateClient>
  );
}
