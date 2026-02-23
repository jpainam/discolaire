"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, HelpCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { BreadcrumbsSetter } from "~/components/BreadcrumbsSetter";
import {
  CNPS_RATE,
  CNSS_RATE,
  MONTHS,
  PayrollForm,
} from "~/components/shared/PayrollForm";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { useTRPC } from "~/trpc/react";

export default function EditPayrollPage(props: {
  params: Promise<{ salaryId: string }>;
}) {
  const { salaryId } = use(props.params);
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const t = useTranslations();

  const payrollQuery = useQuery(trpc.payroll.get.queryOptions(salaryId));

  const updatePayroll = useMutation(
    trpc.payroll.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.payroll.pathFilter());
        toast.success("Paiement mis à jour avec succès");
        router.push("/administration/accounting/salary");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const payroll = payrollQuery.data;

  // Reconstruct form defaults from stored payroll data.
  // Since advance and other deductions are not stored separately, we place
  // the remainder after CNPS/CNSS into "other deductions" and set advance to 0.
  const defaultValues = payroll
    ? (() => {
        const period = new Date(payroll.period);
        const month = MONTHS[period.getMonth()];
        const year = period.getFullYear().toString();
        const grossSalary = payroll.baseSalary.toString();
        const cnps = payroll.baseSalary * CNPS_RATE;
        const cnss = payroll.baseSalary * CNSS_RATE;
        const remaining = Math.max(0, payroll.deductions - cnps - cnss);
        return {
          staffId: payroll.staffId,
          month,
          year,
          grossSalary,
          advance: "0",
          otherDeductions: remaining > 0 ? remaining.toString() : "",
          paymentMode: payroll.method.toLowerCase(),
          paymentDate: "",
          observations: payroll.observation ?? "",
        };
      })()
    : undefined;

  // Pre-populate the calculation summary so it shows immediately.
  const initialCalculated = payroll
    ? (() => {
        const cnps = payroll.baseSalary * CNPS_RATE;
        const cnss = payroll.baseSalary * CNSS_RATE;
        const other = Math.max(0, payroll.deductions - cnps - cnss);
        return {
          cnps,
          cnss,
          advance: 0,
          other,
          total: payroll.deductions,
          net: payroll.netSalary,
        };
      })()
    : undefined;

  return (
    <div className="flex flex-col gap-4 p-4">
      <BreadcrumbsSetter
        items={[
          { label: t("administration"), href: "/administration" },
          { label: t("Finances"), href: "/administration/accounting" },
          {
            label: t("Salary & Payroll"),
            href: "/administration/accounting/salary",
          },
          { label: t("edit") },
        ]}
      />
      <div className="flex items-center justify-between">
        <Label>
          Modification du paiement
          {payroll?.paymentRef ? (
            <span className="text-muted-foreground ml-2 text-sm font-normal">
              {payroll.paymentRef}
            </span>
          ) : null}
        </Label>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 bg-transparent">
            <HelpCircle className="h-4 w-4" />
            Aide
          </Button>
          <Button variant="outline" className="gap-2 bg-transparent" asChild>
            <Link href="/administration/accounting/salary">
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Link>
          </Button>
        </div>
      </div>

      {payrollQuery.isLoading ? (
        <div className="flex items-center justify-center py-24">
          <p className="text-muted-foreground text-sm">Chargement...</p>
        </div>
      ) : !payroll ? (
        <div className="flex items-center justify-center py-24">
          <p className="text-destructive text-sm">Paiement introuvable.</p>
        </div>
      ) : (
        <PayrollForm
          key={salaryId}
          defaultValues={defaultValues}
          initialCalculated={initialCalculated}
          onSave={(data) => updatePayroll.mutate({ id: salaryId, ...data })}
          isSaving={updatePayroll.isPending}
        />
      )}
    </div>
  );
}
