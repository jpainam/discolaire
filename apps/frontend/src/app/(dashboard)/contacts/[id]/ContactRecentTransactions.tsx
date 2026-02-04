"use client";

import Link from "next/link";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";

import { Badge } from "~/components/base-badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useRouter } from "~/hooks/use-router";
import { CURRENCY } from "~/lib/constants";
import { useTRPC } from "~/trpc/react";

export function ContactRecentTransactions({
  contactId,
}: {
  contactId: string;
}) {
  const trpc = useTRPC();
  const { data: transactions } = useSuspenseQuery(
    trpc.contact.transactions.queryOptions(contactId),
  );
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions récentes</CardTitle>
        <CardDescription>Liste des paiments de mes élèves</CardDescription>
        <CardAction>
          <Button
            size={"xs"}
            onClick={() => {
              router.push(`/contacts/${contactId}/transactions`);
            }}
            variant={"link"}
          >
            Voir plus
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("date")}</TableHead>
              <TableHead>{t("student")}</TableHead>
              <TableHead className="text-center">
                {t("transactionRef")}
              </TableHead>
              <TableHead className="text-center">{t("amount")}</TableHead>
              <TableHead className="text-center">{t("status")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.slice(0, 4).map((t) => {
              return (
                <TableRow key={t.id}>
                  <TableCell>
                    {t.createdAt.toLocaleDateString(locale, {
                      month: "numeric",
                      year: "2-digit",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/students/${t.studentId}/transactions`}
                      className="text-muted-foreground hover:underline"
                    >
                      {t.student.lastName ?? t.student.firstName}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-center">
                    <Link
                      className="hover:underline"
                      href={`/students/${t.studentId}/transactions/${t.id}`}
                    >
                      {t.transactionRef}
                    </Link>
                  </TableCell>
                  <TableCell className="text-center">
                    {t.amount.toLocaleString(locale, {
                      style: "currency",
                      maximumFractionDigits: 0,
                      minimumFractionDigits: 0,
                      currency: CURRENCY,
                    })}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      size={"xs"}
                      appearance={"light"}
                      variant={
                        t.status == "VALIDATED"
                          ? "success"
                          : t.status == "PENDING"
                            ? "warning"
                            : "secondary"
                      }
                    >
                      {t.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
