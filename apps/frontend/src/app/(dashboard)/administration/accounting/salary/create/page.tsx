"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, HelpCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { BreadcrumbsSetter } from "~/components/BreadcrumbsSetter";
import { PayrollForm } from "~/components/shared/PayrollForm";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { useTRPC } from "~/trpc/react";

export default function NouveauPaiementPage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const t = useTranslations();

  const createPayroll = useMutation(
    trpc.payroll.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.payroll.pathFilter());
        toast.success("Paiement enregistré avec succès");
        router.push("/administration/accounting/salary");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

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
          { label: t("create") },
        ]}
      />
      <div className="flex items-center justify-between">
        <Label>Création d&apos;un nouveau paiement</Label>
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

      <PayrollForm
        onSave={(data) => createPayroll.mutate(data)}
        isSaving={createPayroll.isPending}
      />
    </div>
  );
}
