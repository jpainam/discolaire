"use client";

import { useAtom } from "jotai";
import Link from "next/link";

import type { RouterOutputs } from "@repo/api";
import { Checkbox } from "@repo/ui/components/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { useLocale } from "~/i18n";

import { Badge } from "@repo/ui/components/badge";
import { cn } from "@repo/ui/lib/utils";
import i18next from "i18next";
import { selectedStudentIdsAtom } from "~/atoms/transactions";
import { AvatarState } from "~/components/AvatarState";
import { routes } from "~/configs/routes";
import { CURRENCY } from "~/lib/constants";
import { getFullName } from "~/utils";

type StudentAccountWithBalance = NonNullable<
  RouterOutputs["classroom"]["studentsBalance"]
>;

export function ListViewFinance({
  students,
  amountDue,
  type,
}: {
  students: StudentAccountWithBalance;
  amountDue: number;
  type: string;
}) {
  const { t, i18n } = useLocale();
  const [selectedStudents, setSelectedStudents] = useAtom(
    selectedStudentIdsAtom
  );

  const total = students.reduce(
    (acc, stud) => acc + (stud.balance - amountDue),
    0
  );
  return (
    <div className="px-4">
      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[40px]">
                <Checkbox
                  onCheckedChange={(checked) => {
                    setSelectedStudents((_stds) =>
                      checked ? students.map((stud) => stud.student.id) : []
                    );
                  }}
                />
              </TableHead>
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
            {students.map((stud) => {
              const remaining = stud.balance - amountDue;
              if (type == "credit" && remaining < 0) {
                return null;
              }
              if (type == "debit" && remaining > 0) {
                return null;
              }
              return (
                <TableRow key={stud.id}>
                  <TableCell>
                    <Checkbox
                      onCheckedChange={(checked) => {
                        setSelectedStudents((students) =>
                          checked
                            ? [...students, stud.student.id]
                            : students.filter((id) => id !== stud.student.id)
                        );
                      }}
                      checked={selectedStudents.includes(stud.student.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <AvatarState
                      pos={getFullName(stud.student).length}
                      avatar={stud.student.user?.avatar}
                    />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {stud.student.registrationNumber}
                  </TableCell>
                  <TableCell>
                    <Link
                      className="hover:text-blue-600 hover:underline"
                      href={routes.students.details(stud.student.id)}
                    >
                      {getFullName(stud.student)}
                    </Link>
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell className="w-32">
                    <div
                      className={cn(
                        "w-fit px-2 text-center text-primary-foreground rounded-sm",
                        remaining < 0 ? "bg-red-500" : "bg-green-500"
                      )}
                    >
                      {remaining < 0 ? "#D#" : "#C#"}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>{t("total")}</TableCell>
              <TableCell className="text-right">
                {total.toLocaleString(i18n.language, {
                  style: "currency",
                  currency: CURRENCY,
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0,
                })}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
