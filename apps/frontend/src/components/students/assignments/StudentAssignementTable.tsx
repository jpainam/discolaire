"use client";

import { useMemo } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { isSameDay } from "date-fns";
import { useLocale, useTranslations } from "next-intl";
import { parseAsString, useQueryState } from "nuqs";

import { Badge } from "~/components/base-badge";
import { EmptyComponent } from "~/components/EmptyComponent";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useRouter } from "~/hooks/use-router";
import { ViewIcon } from "~/icons";
import { useTRPC } from "~/trpc/react";

export function StudentAssignmentTable({
  classroomId,
}: {
  classroomId: string;
}) {
  const trpc = useTRPC();
  const { data: assignments } = useSuspenseQuery(
    trpc.classroom.assignments.queryOptions(classroomId),
  );
  const [term] = useQueryState("term", parseAsString);

  const items = useMemo(() => {
    if (term) return assignments.filter((item) => item.termId === term);
    return assignments;
  }, [assignments, term]);

  const t = useTranslations();

  const router = useRouter();
  const locale = useLocale();
  return (
    <div className="px-4 py-2">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>{t("schedule_date")}</TableHead>
              <TableHead>{t("title")}</TableHead>
              <TableHead>{t("course")}</TableHead>
              <TableHead>{t("teacher")}</TableHead>
              <TableHead className="text-center">{t("coefficient")}</TableHead>
              <TableHead className="text-center">{t("status")}</TableHead>
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
                    {item.dueDate.toLocaleDateString(locale, {
                      month: "short",
                      year: "numeric",
                      day: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.subject.course.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.subject.teacher?.lastName}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-center">
                    {item.subject.coefficient}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      appearance={"light"}
                      variant={
                        hasPassed
                          ? "destructive"
                          : current
                            ? "success"
                            : "warning"
                      }
                    >
                      {hasPassed
                        ? t("passed")
                        : current
                          ? t("current")
                          : t("incoming")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      onClick={() => {
                        router.push(
                          `/classrooms/${classroomId}/assignments/${item.id}`,
                        );
                      }}
                      variant={"link"}
                    >
                      <ViewIcon />
                      {t("details")}
                    </Button>
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
