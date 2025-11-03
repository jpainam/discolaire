"use client";

import Link from "next/link";
import { CheckCircleIcon, CircleXIcon, MoreVertical } from "lucide-react";
import { useLocale } from "next-intl";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardAction,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";

import { AvatarState } from "~/components/AvatarState";
import { Pill, PillStatus } from "~/components/pill";
import { CURRENCY } from "~/lib/constants";
import { getFullName } from "~/utils";

export function GridViewFinanceCard({
  studentBalance,
  amountDue,
  type,
}: {
  amountDue: Record<string, number>;
  type: string;
  studentBalance: RouterOutputs["classroom"]["studentsBalance"][number];
}) {
  const locale = useLocale();
  console.log(type);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row items-center gap-2">
          <AvatarState
            className="h-[35px] w-[35px]"
            pos={getFullName(studentBalance).length}
            avatar={studentBalance.user.avatar}
          />
          <div className="flex flex-col gap-2">
            <Link
              className="hover:underline"
              href={`/students/${studentBalance.studentId}`}
            >
              {getFullName(studentBalance)}
            </Link>
            <div className="flex flex-row items-center gap-2">
              {studentBalance.balances.map((b, index) => {
                const remaining = b.balance - (amountDue[b.journalId] ?? 0);
                // if (type == "credit" && remaining < 0) {
                //   return <></>;
                // }
                // if (type == "debit" && remaining > 0) {
                //   return <></>;
                // }
                return (
                  <Pill
                    key={index}
                    className={remaining < 0 ? "text-destructive" : ""}
                  >
                    <PillStatus>
                      {remaining < 0 ? (
                        <CircleXIcon size={12} className="text-destructive" />
                      ) : (
                        <CheckCircleIcon className="text-green-500" size={12} />
                      )}
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
            </div>
          </div>
        </CardTitle>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size={"icon-sm"} variant={"ghost"}>
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Notification</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
    </Card>
  );
}
