"use client";

import Link from "next/link";
import { CheckCircleIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import type { RouterOutputs } from "@repo/api";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";

import { AvatarState } from "~/components/AvatarState";
import { Pill, PillStatus } from "~/components/pill";
import { CURRENCY } from "~/lib/constants";
import { getFullName } from "~/utils";

export function ListViewFinance({
  students,
  amountDue,
  type,
}: {
  students: RouterOutputs["classroom"]["studentsBalance"];
  amountDue: Record<string, number>;
  type: string;
}) {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <div className="px-4 py-2">
      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[50px]"></TableHead>
              <TableHead className="w-[100px]">
                {t("registrationNumber")}
              </TableHead>
              <TableHead>{t("fullName")}</TableHead>
              <TableHead>{t("balance")}</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((stud, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>
                    <AvatarState
                      pos={getFullName(stud).length}
                      avatar={stud.user.avatar}
                    />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {stud.registrationNumber}
                  </TableCell>
                  <TableCell>
                    <Link
                      className="hover:text-blue-600 hover:underline"
                      href={`/students/${stud.studentId}`}
                    >
                      {getFullName(stud)}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {stud.balances.map((b, index2) => {
                      const remaining =
                        b.balance - (amountDue[b.journalId] ?? 0);
                      if (type == "credit" && remaining < 0) {
                        return <></>;
                      }
                      if (type == "debit" && remaining > 0) {
                        return <></>;
                      }
                      return (
                        <Pill
                          key={index2}
                          className={remaining < 0 ? "text-destructive" : ""}
                        >
                          <PillStatus>
                            <CheckCircleIcon
                              className="text-emerald-500"
                              size={12}
                            />
                            {b.journal.name}
                          </PillStatus>
                          {remaining.toLocaleString(locale, {
                            currency: CURRENCY,
                            maximumFractionDigits: 0,
                            minimumFractionDigits: 0,
                          })}{" "}
                          {CURRENCY}
                        </Pill>
                      );
                    })}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>{t("total")}</TableCell>
              <TableCell className="text-right">
                {/* {total.toLocaleString(i18n.language, {
                  style: "currency",
                  currency: CURRENCY,
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0,
                })} */}
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
