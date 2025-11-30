"use client";

import { isSameDay } from "date-fns";
import i18next from "i18next";
import { Eye } from "lucide-react";
import { useTranslations } from "next-intl";
import { parseAsString, useQueryState } from "nuqs";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";

import { EmptyComponent } from "~/components/EmptyComponent";
import FlatBadge from "~/components/FlatBadge";
import { routes } from "~/configs/routes";
import { useRouter } from "~/hooks/use-router";

type StudentAssignment = RouterOutputs["classroom"]["assignments"][number];
export function StudentAssignmentTable({
  assignments,
}: {
  assignments: StudentAssignment[];
}) {
  const [term] = useQueryState("term", parseAsString);
  const items = term
    ? assignments.filter((item) => item.termId === term)
    : assignments;

  const t = useTranslations();

  const router = useRouter();
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>{t("schedule_date")}</TableHead>
            <TableHead>{t("title")}</TableHead>
            <TableHead>{t("course")}</TableHead>
            <TableHead>{t("teacher")}</TableHead>
            <TableHead>{t("coefficient")}</TableHead>
            <TableHead>{t("status")}</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 && (
            <TableRow>
              <TableCell colSpan={7}>
                <EmptyComponent />
              </TableCell>
            </TableRow>
          )}
          {items.map((item) => {
            const hasPassed = item.dueDate < new Date();
            const current = isSameDay(item.dueDate, new Date());
            return (
              <TableRow key={item.id}>
                <TableCell className="py-0">
                  {item.dueDate.toLocaleDateString(i18next.language, {
                    month: "short",
                    year: "numeric",
                    day: "2-digit",
                  })}
                </TableCell>
                <TableCell className="py-0">{item.title}</TableCell>
                <TableCell className="py-0">
                  {item.subject.course.name}
                </TableCell>
                <TableCell className="py-0">
                  {item.subject.teacher?.lastName}
                </TableCell>
                <TableCell className="py-0">
                  {item.subject.coefficient}
                </TableCell>
                <TableCell className="py-0">
                  <FlatBadge
                    variant={hasPassed ? "red" : current ? "green" : "yellow"}
                  >
                    {hasPassed
                      ? t("passed")
                      : current
                        ? t("current")
                        : t("incoming")}
                  </FlatBadge>
                </TableCell>
                <TableCell className="py-0 text-right">
                  <Button
                    onClick={() => {
                      router.push(routes.assignments.details(item.id));
                    }}
                    variant={"ghost"}
                    size={"icon"}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
