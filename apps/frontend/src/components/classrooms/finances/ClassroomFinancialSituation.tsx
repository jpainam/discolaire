"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { parseAsString, useQueryState } from "nuqs";

import { Badge } from "~/components/base-badge";
import { EmptyComponent } from "~/components/EmptyComponent";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { UserLink } from "~/components/UserLink";
import { CURRENCY } from "~/lib/constants";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";

const sum = (values: number[]) => values.reduce((acc, value) => acc + value, 0);

export function ClassroomFinancialSituation() {
  const trpc = useTRPC();
  const params = useParams<{ id: string }>();
  const t = useTranslations();
  const locale = useLocale();

  const { data: fees } = useSuspenseQuery(
    trpc.classroom.fees.queryOptions(params.id),
  );

  const { data: journals } = useSuspenseQuery(
    trpc.accountingJournal.all.queryOptions(),
  );

  const { data: balances } = useSuspenseQuery(
    trpc.classroom.studentsBalance.queryOptions(params.id),
  );
  const [today] = useState(() => new Date());

  const journalsWithFees = useMemo(() => {
    const classroomJournalIds = new Set(fees.map((fee) => fee.journalId));
    return journals.filter((journal) => classroomJournalIds.has(journal.id));
  }, [fees, journals]);

  const amountDues = useMemo(() => {
    const dues = new Map<string, number>();

    for (const fee of fees) {
      if (!fee.journalId || fee.dueDate > today) continue;
      dues.set(fee.journalId, (dues.get(fee.journalId) ?? 0) + fee.amount);
    }

    return dues;
  }, [fees, today]);

  const [journalId, setJournalId] = useQueryState("journalId", parseAsString);
  const [status] = useQueryState("status");

  const selectedJournalId = useMemo(() => {
    const exists = journalsWithFees.some((journal) => journal.id === journalId);
    return exists ? journalId : journalsWithFees[0]?.id;
  }, [journalId, journalsWithFees]);

  const fallbackJournalId = journalsWithFees.at(0)?.id;
  if (!fallbackJournalId) {
    return (
      <EmptyComponent
        title="Aucune transaction"
        description="Vous devez saisir ou entrer quelques frais scolaire"
      />
    );
  }

  const activeJournalId = selectedJournalId ?? fallbackJournalId;

  return (
    <Tabs
      className="px-4"
      value={activeJournalId}
      onValueChange={(value) => {
        void setJournalId(value);
      }}
    >
      <TabsList>
        {journalsWithFees.map((journal) => (
          <TabsTrigger key={journal.id} value={journal.id}>
            {journal.name}
          </TabsTrigger>
        ))}
      </TabsList>

      {journalsWithFees.map((journal) => {
        const amountDue = amountDues.get(journal.id) ?? 0;
        const students = balances.map((student) => {
          const paid =
            student.journals.find((j) => j.journalId === journal.id)?.balance ??
            0;
          const remaining = amountDue - paid;
          return {
            student,
            paid,
            remaining,
          };
        });

        const filteredStudents = students.filter((entry) => {
          if (status === "credit") return entry.remaining < 0;
          if (status === "debit") return entry.remaining > 0;
          return true;
        });

        const totalPaid = sum(filteredStudents.map((entry) => entry.paid));
        const totalDue = amountDue * filteredStudents.length;
        const totalRemaining = sum(
          filteredStudents.map((entry) => entry.remaining),
        );

        return (
          <TabsContent key={journal.id} value={journal.id}>
            <div className="bg-background overflow-hidden rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>{t("fullName")}</TableHead>
                    <TableHead>{t("registrationNumber")}</TableHead>
                    <TableHead>{t("amountPaid")}</TableHead>
                    <TableHead>{t("amountDue")}</TableHead>
                    <TableHead>{t("remaining")}</TableHead>
                    <TableHead>{t("status")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map(({ student, paid, remaining }) => {
                    return (
                      <TableRow key={student.id}>
                        <TableCell>
                          <UserLink
                            id={student.studentId}
                            name={getFullName(student)}
                            profile="student"
                            avatar={student.avatar}
                          />
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {student.registrationNumber ?? "-"}
                        </TableCell>
                        <TableCell>
                          {paid.toLocaleString(locale, {
                            style: "currency",
                            currency: CURRENCY,
                            maximumFractionDigits: 0,
                            minimumFractionDigits: 0,
                          })}
                        </TableCell>
                        <TableCell>
                          {amountDue.toLocaleString(locale, {
                            style: "currency",
                            currency: CURRENCY,
                            maximumFractionDigits: 0,
                            minimumFractionDigits: 0,
                          })}
                        </TableCell>
                        <TableCell>
                          {remaining.toLocaleString(locale, {
                            style: "currency",
                            currency: CURRENCY,
                            maximumFractionDigits: 0,
                            minimumFractionDigits: 0,
                          })}
                        </TableCell>
                        <TableCell>
                          <Badge
                            appearance="outline"
                            variant={
                              remaining > 0
                                ? "destructive"
                                : remaining < 0
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {remaining > 0
                              ? t("debit")
                              : remaining < 0
                                ? t("credit")
                                : t("all")}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {filteredStudents.length === 0 ? (
                    <TableRow>
                      <TableCell className="text-muted-foreground" colSpan={6}>
                        {t("no_data")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow>
                      <TableCell className="font-semibold">
                        {t("total")}
                      </TableCell>
                      <TableCell />
                      <TableCell className="font-semibold">
                        {totalPaid.toLocaleString(locale, {
                          style: "currency",
                          currency: CURRENCY,
                          maximumFractionDigits: 0,
                          minimumFractionDigits: 0,
                        })}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {totalDue.toLocaleString(locale, {
                          style: "currency",
                          currency: CURRENCY,
                          maximumFractionDigits: 0,
                          minimumFractionDigits: 0,
                        })}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {totalRemaining.toLocaleString(locale, {
                          style: "currency",
                          currency: CURRENCY,
                          maximumFractionDigits: 0,
                          minimumFractionDigits: 0,
                        })}
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
