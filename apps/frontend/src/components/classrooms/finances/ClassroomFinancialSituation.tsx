"use client";

import { useParams } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { MailIcon, MoreVertical } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { parseAsString, useQueryState } from "nuqs";

import type { RouterOutputs } from "@repo/api";

import { Badge } from "~/components/base-badge";
import { BalanceReminderLetter } from "~/components/classrooms/finances/BalanceReminderLetter";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { UserLink } from "~/components/UserLink";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { CURRENCY } from "~/lib/constants";
import { PermissionAction } from "~/permissions";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";

const sum = (a: number[]) => a.reduce((acc, val) => acc + val, 0);
export function ClassroomFinancialSituation() {
  const trpc = useTRPC();
  const params = useParams<{ id: string }>();
  const { data: fees } = useSuspenseQuery(
    trpc.classroom.fees.queryOptions(params.id),
  );

  const { data: journals } = useSuspenseQuery(
    trpc.accountingJournal.all.queryOptions(),
  );

  const { data: balances } = useSuspenseQuery(
    trpc.classroom.studentsBalance.queryOptions(params.id),
  );

  const amountDues = new Map<string, number>();
  for (const journal of journals) {
    const amountDue = sum(
      fees
        .filter(
          (fee) => fee.dueDate <= new Date() && fee.journalId === journal.id,
        )
        .map((fee) => fee.amount),
    );
    amountDues.set(journal.id, amountDue);
  }

  const [view] = useQueryState("view");
  const [situation] = useQueryState(
    "situation",
    parseAsString.withDefault("all"),
  );
  const canCreateTransaction = useCheckPermission(
    "transaction",
    PermissionAction.CREATE,
  );

  return (
    <div>
      {view === "list" ? (
        <ListViewFinance
          situation={situation}
          amountDues={amountDues}
          students={balances}
          canCreateTransaction={canCreateTransaction}
        />
      ) : (
        <div className="grid gap-4 p-2 text-sm md:grid-cols-2 xl:md:grid-cols-3">
          {balances.map((balance) => {
            return (
              <GridViewFinanceCard
                canCreateTransaction={canCreateTransaction}
                situation={situation}
                amountDues={amountDues}
                student={balance}
                key={balance.id}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function ListViewFinance({
  students,
  amountDues,
  situation,
  canCreateTransaction,
}: {
  students: RouterOutputs["classroom"]["studentsBalance"];
  amountDues: Map<string, number>;
  situation: string;
  canCreateTransaction: boolean;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const [journalId] = useQueryState("journalId");
  const { openModal } = useModal();
  const params = useParams<{ id: string }>();

  return (
    <div className="px-4 py-2">
      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead></TableHead>
              <TableHead>{t("fullName")}</TableHead>
              <TableHead>{t("registrationNumber")}</TableHead>
              <TableHead></TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((stud) => {
              return (
                <TableRow key={stud.id}>
                  <TableCell></TableCell>{" "}
                  <TableCell>
                    <UserLink
                      id={stud.studentId}
                      name={getFullName(stud)}
                      profile="student"
                      avatar={stud.user?.avatar}
                    />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {stud.registrationNumber}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-row items-center gap-2">
                      {stud.journals
                        .filter((j) =>
                          journalId ? j.journalId == journalId : true,
                        )
                        .map((journalBalance) => {
                          const amountDue =
                            amountDues.get(journalBalance.journalId) ?? 0;
                          const remaining = journalBalance.balance - amountDue;
                          if (situation == "credit" && remaining < 0) {
                            return null;
                          }
                          if (situation == "debit" && remaining > 0) {
                            return null;
                          }
                          return (
                            <div key={journalBalance.journalId}>
                              {journalBalance.name} :{" "}
                              <Badge
                                appearance={"outline"}
                                variant={
                                  remaining < 0 ? "destructive" : "secondary"
                                }
                              >
                                {remaining.toLocaleString(locale, {
                                  currency: CURRENCY,
                                  maximumFractionDigits: 0,
                                  minimumFractionDigits: 0,
                                })}{" "}
                                {CURRENCY}
                              </Badge>
                            </div>
                          );
                        })}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant={"ghost"} size={"icon-sm"}>
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {canCreateTransaction && (
                          <DropdownMenuItem
                            onSelect={() => {
                              openModal({
                                title: t("reminder_letter"),
                                description:
                                  "Veuillez sélectionner les options",
                                view: (
                                  <BalanceReminderLetter
                                    format="pdf"
                                    studentId={stud.studentId}
                                    classroomId={params.id}
                                  />
                                ),
                              });
                            }}
                          >
                            <MailIcon />
                            {t("reminder_letter")}
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function GridViewFinanceCard({
  student,
  amountDues,
  situation,
  canCreateTransaction,
}: {
  amountDues: Map<string, number>;
  situation: string;
  student: RouterOutputs["classroom"]["studentsBalance"][number];
  canCreateTransaction: boolean;
}) {
  const locale = useLocale();
  const t = useTranslations();
  const { openModal } = useModal();
  const params = useParams<{ id: string }>();

  return (
    <Card className="p-2">
      <CardHeader className="p-0">
        <CardTitle>
          <UserLink
            profile="student"
            id={student.studentId}
            name={getFullName(student)}
            avatar={student.user?.avatar}
          />
        </CardTitle>
        <CardDescription>
          <div className="flex cursor-pointer flex-row items-center gap-4">
            {student.journals.map((journalBalance, index) => {
              const amountDue = amountDues.get(journalBalance.journalId) ?? 0;
              const remaining = journalBalance.balance - amountDue;

              if (situation == "credit" && remaining < 0) {
                return null;
              }
              if (situation == "debit" && remaining > 0) {
                return null;
              }
              return (
                <Badge
                  key={`${index}-${student.id}`}
                  variant={remaining < 0 ? "destructive" : "secondary"}
                  appearance={"outline"}
                >
                  {journalBalance.name} :{" "}
                  {remaining.toLocaleString(locale, {
                    currency: CURRENCY,
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                  })}{" "}
                  {CURRENCY}
                </Badge>
              );
            })}
          </div>
        </CardDescription>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"ghost"} size={"icon-sm"}>
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {canCreateTransaction && (
                <DropdownMenuItem
                  onSelect={() => {
                    openModal({
                      title: t("reminder_letter"),
                      description: "Veuillez sélectionner les options",
                      view: (
                        <BalanceReminderLetter
                          format="pdf"
                          studentId={student.studentId}
                          classroomId={params.id}
                        />
                      ),
                    });
                  }}
                >
                  <MailIcon />
                  {t("reminder_letter")}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
    </Card>
  );
}
