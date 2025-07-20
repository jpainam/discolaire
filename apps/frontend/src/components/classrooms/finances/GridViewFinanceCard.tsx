"use client";

import { useCallback } from "react";
import Link from "next/link";
import i18next from "i18next";
import { useAtom } from "jotai";
import { ArrowDownUp, AtSign, DollarSign, Phone, Users } from "lucide-react";

import type { RouterOutputs } from "@repo/api";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";

import { selectedStudentIdsAtom } from "~/atoms/transactions";
import { AvatarState } from "~/components/AvatarState";
import { SimpleTooltip } from "~/components/simple-tooltip";
import { routes } from "~/configs/routes";
import { useLocale } from "~/i18n";
import { CURRENCY } from "~/lib/constants";
import { cn } from "~/lib/utils";
import { getFullName } from "~/utils";

type StudentAccountWithBalance = NonNullable<
  RouterOutputs["classroom"]["studentsBalance"]
>[number];

export function GridViewFinanceCard({
  studentBalance,
  amountDue,
  type,
}: {
  amountDue: number;
  type: string;
  studentBalance: StudentAccountWithBalance;
}) {
  const [selectedStudents, setSelectedStudents] = useAtom(
    selectedStudentIdsAtom,
  );

  const student = studentBalance;
  const balance = studentBalance.balance;

  const handleClick = useCallback(() => {
    setSelectedStudents((students) =>
      students.includes(student.id)
        ? students.filter((id) => id !== student.id)
        : [...students, student.id],
    );
  }, [setSelectedStudents, student.id]);

  const { t } = useLocale();
  const remaining = balance - amountDue;

  if (type == "credit" && remaining < 0) {
    return null;
  }
  if (type == "debit" && remaining > 0) {
    return null;
  }
  return (
    <Card
      className={cn(
        "hover:bg-muted rounded-sm p-2 shadow-none hover:shadow-md",
        selectedStudents.includes(student.id) && "bg-muted border-green-600",
      )}
    >
      <CardContent className="flex flex-row items-start p-0">
        <AvatarState
          className="h-[25px] w-[25px]"
          pos={getFullName(student).length}
          avatar={student.user?.avatar}
        />

        <div className="flex w-full flex-col justify-between gap-2 px-2">
          <div
            onClick={handleClick}
            className="flex w-full cursor-pointer flex-col"
          >
            <div className="flex w-full flex-row items-center justify-between text-xs">
              {student.registrationNumber}
            </div>
            <div className="flex flex-row items-center justify-between pr-4">
              <SimpleTooltip content={getFullName(student)}>
                <span className="line-clamp-1 text-xs">
                  {getFullName(student)}
                </span>
              </SimpleTooltip>
            </div>
          </div>
          <div className="flex flex-row gap-1">
            <SimpleTooltip content={t("financial_situation")}>
              <Link href={routes.students.transactions.index(student.id)}>
                <Button variant={"ghost"} className="h-6 w-6" size={"icon"}>
                  <DollarSign />
                </Button>
              </Link>
            </SimpleTooltip>
            <SimpleTooltip content={student.phoneNumber ?? "@phone"}>
              <Button variant={"ghost"} size={"icon"} className="h-6 w-6">
                <Phone />
              </Button>
            </SimpleTooltip>
            <SimpleTooltip content={student.user?.email ?? "@email"}>
              <Button variant={"ghost"} size={"icon"} className="h-6 w-6">
                <AtSign />
              </Button>
            </SimpleTooltip>
            <SimpleTooltip content={t("contacts")}>
              <Button
                variant={"ghost"}
                size={"icon"}
                className="h-6 w-6"
                onClick={() => {
                  console.log(routes.students.contacts(student.id));
                }}
              >
                <Users />
              </Button>
            </SimpleTooltip>
          </div>
        </div>

        <div
          onClick={handleClick}
          className="flex cursor-pointer flex-col items-center justify-between gap-2"
        >
          <span className="text-sm font-semibold">{t("balance")}</span>
          <span>
            <ArrowDownUp className="h-3 w-3" />
          </span>
          <Badge
            variant={remaining < 0 ? "outline" : "default"}
            className={remaining < 0 ? "text-destructive" : ""}
          >
            {remaining.toLocaleString(i18next.language, {
              currency: CURRENCY,
              maximumFractionDigits: 0,
              minimumFractionDigits: 0,
            })}{" "}
            {CURRENCY}
          </Badge>
          {/* <FlatBadge
            className="flex w-28 items-center justify-center text-xs"
            variant={remaining < 0 ? "red" : remaining > 0 ? "green" : "indigo"}
          >
            {moneyFormatter.format(remaining)}
          </FlatBadge> */}
        </div>
      </CardContent>
    </Card>
  );
}
