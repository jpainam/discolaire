"use client";

import { useEffect, useState } from "react";
import { isSameDay } from "date-fns";
import { Eye } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";

import type { RouterOutputs } from "@repo/api";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/components/button";
import { EmptyState } from "@repo/ui/components/EmptyState";
import FlatBadge from "@repo/ui/components/FlatBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";

import { routes } from "~/configs/routes";
import { useRouter } from "~/hooks/use-router";
import { useDateFormat } from "~/utils/date-format";

type StudentAssignment = RouterOutputs["classroom"]["assignments"][number];
export function StudentAssignmentTable({
  assignments,
}: {
  assignments: StudentAssignment[];
}) {
  const [term] = useQueryState("term", parseAsInteger);
  const [items, setItems] = useState(assignments);
  useEffect(() => {
    if (!term) {
      setItems(assignments);
      return;
    }
    setItems(assignments.filter((item) => item.termId === term));
  }, [assignments, term]);

  const { t } = useLocale();
  const { fullDateFormatter } = useDateFormat();
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
                <EmptyState className="my-8" />
              </TableCell>
            </TableRow>
          )}
          {items.map((item) => {
            const hasPassed = item.dueDate < new Date();
            const current = isSameDay(item.dueDate, new Date());
            return (
              <TableRow key={item.id}>
                <TableCell className="py-0">
                  {fullDateFormatter.format(item.dueDate)}
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
