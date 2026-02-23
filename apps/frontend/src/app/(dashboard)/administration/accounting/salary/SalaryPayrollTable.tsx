"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Edit, Eye, Filter, RotateCcw, Trash2 } from "lucide-react";
import { useLocale } from "next-intl";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
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

function formatAmount(amount: number) {
  return new Intl.NumberFormat("fr-FR").format(amount);
}

export function SalaryPayrollTable() {
  const trpc = useTRPC();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = searchParams.get("query") ?? undefined;
  const status =
    (searchParams.get("status") as PayrollStatus | null) ?? undefined;
  const period = searchParams.get("period") ?? undefined;

  const { data: payrolls } = useSuspenseQuery(
    trpc.payroll.all.queryOptions({
      limit: 20,
      query,
      status,
      period: period ? new Date(period) : undefined,
    }),
  );

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all-status") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`);
  }

  function resetFilters() {
    router.push("?");
  }

  const hasFilters = query ?? status ?? period;

  return (
    <div className="px-4 pt-4">
      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          placeholder="Rechercher (nom, N° paiement...)"
          className="bg-background w-64"
          defaultValue={query ?? ""}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              updateParam(
                "query",
                (e.target as HTMLInputElement).value || null,
              );
            }
          }}
          onBlur={(e) => updateParam("query", e.target.value || null)}
        />

        <Select
          value={status ?? "all-status"}
          onValueChange={(v) => updateParam("status", v)}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Tous les statuts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-status">Tous les statuts</SelectItem>
            <SelectItem value="PENDING">En attente</SelectItem>
            <SelectItem value="PAID">Payé</SelectItem>
            <SelectItem value="CANCELED">Annulé</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="month"
          className="bg-background w-48"
          value={period ? period.substring(0, 7) : ""}
          onChange={(e) => {
            const val = e.target.value;
            updateParam("period", val ? `${val}-01` : null);
          }}
        />

        {hasFilters && (
          <Button variant="outline" onClick={resetFilters}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        )}

        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 ml-auto">
          <Filter className="mr-2 h-4 w-4" />
          Filtrer
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-foreground font-semibold">
                N° Paiement
              </TableHead>
              <TableHead className="text-foreground font-semibold">
                Bénéficiaire
              </TableHead>
              <TableHead className="text-foreground font-semibold">
                Type
              </TableHead>
              <TableHead className="text-foreground font-semibold">
                Période
              </TableHead>
              <TableHead className="text-foreground font-semibold">
                Salaire Brut
              </TableHead>
              <TableHead className="text-foreground font-semibold">
                Déductions
              </TableHead>
              <TableHead className="text-foreground font-semibold">
                Salaire Net
              </TableHead>
              <TableHead className="text-foreground font-semibold">
                Statut
              </TableHead>
              <TableHead className="text-foreground font-semibold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payrolls.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-muted-foreground py-10 text-center"
                >
                  Aucun paiement trouvé
                </TableCell>
              </TableRow>
            )}
            {payrolls.map((payroll) => {
              const statusCfg = STATUS_CONFIG[payroll.status];
              return (
                <TableRow key={payroll.id} className="hover:bg-muted/50">
                  <TableCell>
                    <Link
                      href={`/administration/accounting/salary/${payroll.id}`}
                    >
                      <Badge
                        variant="secondary"
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        {payroll.paymentRef ?? payroll.id}
                      </Badge>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-semibold">
                        {[payroll.staff.firstName, payroll.staff.lastName]
                          .filter(Boolean)
                          .join(" ")
                          .toUpperCase()}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {payroll.staff.jobTitle ?? "Personnel"}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="bg-blue-500 text-white hover:bg-blue-600"
                    >
                      {payroll.staff.isTeacher ? "Enseignant" : "Personnel"}
                    </Badge>
                  </TableCell>
                  <TableCell className="capitalize">
                    {payroll.period.toLocaleDateString(locale, {
                      month: "long",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatAmount(payroll.baseSalary)}
                  </TableCell>
                  <TableCell className="font-medium text-red-500">
                    {formatAmount(payroll.deductions)}
                  </TableCell>
                  <TableCell className="font-medium text-green-600">
                    {formatAmount(payroll.netSalary)}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusCfg.className}>
                      {statusCfg.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 bg-transparent"
                        asChild
                      >
                        <Link
                          href={`/administration/accounting/salary/${payroll.id}`}
                        >
                          <Eye className="h-4 w-4 text-blue-500" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 bg-transparent"
                      >
                        <Edit className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 bg-transparent"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {payrolls.length > 0 && (
        <p className="text-muted-foreground mt-3 text-right text-sm">
          {payrolls.length} entrée{payrolls.length > 1 ? "s" : ""} affichée
          {payrolls.length > 1 ? "s" : ""}
          {payrolls.length === 20 ? " (20 dernières)" : ""}
        </p>
      )}
    </div>
  );
}
