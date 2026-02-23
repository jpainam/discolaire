"use client";

import Link from "next/link";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Banknote,
  Calendar,
  CheckCircle,
  CircleX,
  Clock,
  Printer,
  User,
} from "lucide-react";
import { useLocale } from "next-intl";
import { toast } from "sonner";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Table, TableBody, TableCell, TableRow } from "~/components/ui/table";
import { useTRPC } from "~/trpc/react";

type PayrollStatus = "PENDING" | "PAID" | "CANCELED";

const STATUS_CONFIG: Record<
  PayrollStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "En attente",
    className: "bg-orange-500 hover:bg-orange-600 text-white",
  },
  PAID: {
    label: "Payé",
    className: "bg-green-500 hover:bg-green-600 text-white",
  },
  CANCELED: {
    label: "Annulé",
    className: "bg-red-500 hover:bg-red-600 text-white",
  },
};

const METHOD_LABELS: Record<string, string> = {
  VIREMENT: "Virement bancaire",
  ESPECE: "Espèces",
  CHEQUE: "Chèque",
  MOBILE_MONEY: "Mobile Money",
  CASH: "Espèces",
};

function fmt(n: number) {
  return new Intl.NumberFormat("fr-FR").format(n);
}

export function SalaryDetailView({ salaryId }: { salaryId: string }) {
  const trpc = useTRPC();
  const locale = useLocale();
  const queryClient = useQueryClient();

  const { data: payroll } = useSuspenseQuery(
    trpc.payroll.get.queryOptions(salaryId),
  );

  const updateStatus = useMutation(
    trpc.payroll.updateStatus.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.payroll.pathFilter());
        toast.success("Statut mis à jour");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const statusCfg = STATUS_CONFIG[payroll.status];
  const staffName = [payroll.staff.firstName, payroll.staff.lastName]
    .filter(Boolean)
    .join(" ")
    .toUpperCase();
  const periodLabel = payroll.period.toLocaleDateString(locale, {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="bg-transparent" asChild>
            <Link href="/administration/accounting/salary">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">
                {payroll.paymentRef ?? payroll.id}
              </h1>
              <Badge className={statusCfg.className}>{statusCfg.label}</Badge>
            </div>
            <p className="text-muted-foreground text-sm capitalize">
              {periodLabel}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 bg-transparent" size="sm">
            <Printer className="h-4 w-4" />
            Imprimer
          </Button>
          {payroll.status === "PENDING" && (
            <>
              <Button
                size="sm"
                className="gap-2 bg-green-500 text-white hover:bg-green-600"
                disabled={updateStatus.isPending}
                onClick={() =>
                  updateStatus.mutate({ id: payroll.id, status: "PAID" })
                }
              >
                <CheckCircle className="h-4 w-4" />
                Marquer payé
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-2 bg-transparent text-red-500 hover:text-red-600"
                disabled={updateStatus.isPending}
                onClick={() =>
                  updateStatus.mutate({ id: payroll.id, status: "CANCELED" })
                }
              >
                <CircleX className="h-4 w-4" />
                Annuler
              </Button>
            </>
          )}
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-4 lg:col-span-2">
          {/* Staff info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4" />
                Bénéficiaire
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-primary text-primary-foreground grid grid-cols-2 gap-4 rounded-lg p-4 md:grid-cols-4">
                <div>
                  <p className="text-xs opacity-70">Nom</p>
                  <p className="font-semibold">{staffName}</p>
                </div>
                <div>
                  <p className="text-xs opacity-70">Poste</p>
                  <p className="font-semibold">
                    {payroll.staff.jobTitle ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs opacity-70">Type</p>
                  <p className="font-semibold">
                    {payroll.staff.isTeacher ? "Enseignant" : "Personnel"}
                  </p>
                </div>
                <div>
                  <p className="text-xs opacity-70">Banque</p>
                  <p className="font-semibold">
                    {payroll.staff.bankName ?? "—"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Banknote className="h-4 w-4" />
                Informations de paiement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <div>
                  <p className="text-muted-foreground text-xs">Mode</p>
                  <p className="font-medium">
                    {METHOD_LABELS[payroll.method.toUpperCase()] ??
                      payroll.method}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Période</p>
                  <p className="font-medium capitalize">{periodLabel}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Créé le
                  </p>
                  <p className="font-medium">
                    {payroll.createdAt.toLocaleDateString(locale, {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                {payroll.createdBy && (
                  <div>
                    <p className="text-muted-foreground text-xs flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Créé par
                    </p>
                    <p className="font-medium">{payroll.createdBy.name}</p>
                  </div>
                )}
              </div>

              {payroll.observation && (
                <>
                  <Separator className="my-4" />
                  <div>
                    <p className="text-muted-foreground mb-1 text-xs">
                      Observations
                    </p>
                    <p className="text-sm">{payroll.observation}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column – financial summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardContent className="p-6">
              <div className="bg-primary text-primary-foreground mb-6 rounded-lg p-4">
                <h2 className="text-center font-semibold">RÉSUMÉ DU PAIEMENT</h2>
                <p className="mt-1 text-center text-xs capitalize opacity-80">
                  {periodLabel}
                </p>
              </div>

              <div className="border-border overflow-hidden rounded-lg border">
                <Table>
                  <TableBody>
                    <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                      <TableCell className="bg-muted/50 font-medium">
                        Salaire Brut
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {fmt(payroll.baseSalary)} FCFA
                      </TableCell>
                    </TableRow>
                    <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                      <TableCell className="bg-muted/50 font-medium">
                        Déductions
                      </TableCell>
                      <TableCell className="text-right font-medium text-red-500">
                        -{fmt(payroll.deductions)} FCFA
                      </TableCell>
                    </TableRow>
                    <TableRow className="*:border-border bg-muted/50 hover:bg-transparent [&>:not(:last-child)]:border-r">
                      <TableCell className="font-semibold">
                        Total déductions
                      </TableCell>
                      <TableCell className="text-right font-semibold text-red-500">
                        -{fmt(payroll.deductions)} FCFA
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4 rounded-lg border-2 border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
                <div className="text-center">
                  <p className="text-muted-foreground mb-2 text-sm">
                    Net à Payer
                  </p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {fmt(payroll.netSalary)}
                  </p>
                  <p className="text-muted-foreground mt-1 text-sm">FCFA</p>
                </div>
              </div>

              <div className="mt-4 text-center">
                <Badge className={`${statusCfg.className} text-sm px-4 py-1`}>
                  {statusCfg.label}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
