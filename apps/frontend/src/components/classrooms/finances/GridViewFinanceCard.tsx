"use client";

import { useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAtom } from "jotai";
import { ArrowDownUp, AtSign, DollarSign, Phone, Users } from "lucide-react";

import type { RouterOutputs } from "@repo/api";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import FlatBadge from "@repo/ui/components/FlatBadge";

import { selectedStudentIdsAtom } from "~/atoms/transactions";
import { AvatarState } from "~/components/AvatarState";
import { SimpleTooltip } from "~/components/simple-tooltip";
import { routes } from "~/configs/routes";
import { cn } from "~/lib/utils";
import { getFullName } from "~/utils/full-name";
import { useMoneyFormat } from "~/utils/money-format";

type StudentAccountWithBalance = NonNullable<
  RouterOutputs["classroom"]["studentsBalance"]
>[number];

export function GridViewFinanceCard({
  studentBalance,
  amountDue,
}: {
  amountDue: number;
  studentBalance: StudentAccountWithBalance;
}) {
  const [selectedStudents, setSelectedStudents] = useAtom(
    selectedStudentIdsAtom,
  );

  const student = studentBalance.student;
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
  const searchParams = useSearchParams();
  const { moneyFormatter } = useMoneyFormat();
  if (searchParams.get("type") == "credit" && remaining < 0) {
    return null;
  }
  if (searchParams.get("type") == "debit" && remaining > 0) {
    return null;
  }
  return (
    <Card
      className={cn(
        "rounded-sm p-2 shadow-none hover:bg-muted hover:shadow-md",
        selectedStudents.includes(student.id) && "border-green-600 bg-muted",
      )}
    >
      <CardContent className="flex flex-row items-start p-0">
        <AvatarState
          className="h-[25px] w-[25px]"
          pos={getFullName(student).length}
          avatar={student.avatar}
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
                <Button variant={"outline"} className="h-6 w-6" size={"icon"}>
                  <DollarSign className="h-3 w-3" />
                </Button>
              </Link>
            </SimpleTooltip>
            <SimpleTooltip content={student.phoneNumber ?? "@phone"}>
              <Button variant={"outline"} size={"icon"} className="h-6 w-6">
                <Phone className="h-3 w-3" />
              </Button>
            </SimpleTooltip>
            <SimpleTooltip content={student.email ?? "@email"}>
              <Button variant={"outline"} size={"icon"} className="h-6 w-6">
                <AtSign className="h-3 w-3" />
              </Button>
            </SimpleTooltip>
            <SimpleTooltip content={t("contacts")}>
              <Button
                variant={"outline"}
                size={"icon"}
                className="h-6 w-6"
                onClick={() => {
                  console.log(routes.students.contacts(student.id));
                }}
              >
                <Users className="h-3 w-3" />
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
          <FlatBadge
            className="flex w-28 items-center justify-center text-xs"
            variant={remaining < 0 ? "red" : remaining > 0 ? "green" : "indigo"}
          >
            {moneyFormatter.format(remaining)}
          </FlatBadge>
        </div>
      </CardContent>
    </Card>
  );
}
