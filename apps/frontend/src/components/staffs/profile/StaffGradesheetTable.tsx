"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSuspenseQuery } from "@tanstack/react-query";
import { MoreHorizontal } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useQueryState } from "nuqs";

import { Badge } from "~/components/base-badge";
import { EmptyComponent } from "~/components/EmptyComponent";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Label } from "~/components/ui/label";
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

const sum = (num: number[]) => {
  return num.reduce((a, b) => a + b, 0);
};

export function StaffGradesheetTable({ staffId }: { staffId: string }) {
  const trpc = useTRPC();
  const { data: gradesheets } = useSuspenseQuery(
    trpc.staff.gradesheets.queryOptions(staffId),
  );
  const [termId, setTermId] = useQueryState("termId");
  const filtered = useMemo(() => {
    if (termId) {
      return gradesheets.filter((gs) => gs.termId == termId);
    }
    return gradesheets;
  }, [gradesheets, termId]);
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Label>{t("terms")}</Label>
        <TermSelector
          className="w-full md:w-1/2 lg:w-1/4"
          onChange={(val) => {
            void setTermId(val);
          }}
        />
      </div>
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[50px]">{t("createdAt")}</TableHead>
              <TableHead>{t("Label")}</TableHead>
              <TableHead>{t("classroom")}</TableHead>
              <TableHead>{t("subject")}</TableHead>
              <TableHead>{t("term")}</TableHead>
              <TableHead className="text-center">{t("Evaluated")}</TableHead>
              <TableHead className="text-center">{t("min")}</TableHead>
              <TableHead className="text-center">{t("max")}</TableHead>
              <TableHead className="text-center">{t("avg")}</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length == 0 && (
              <TableRow>
                <TableCell colSpan={10}>
                  <EmptyComponent />
                </TableCell>
              </TableRow>
            )}
            {filtered.map((gs, index) => {
              const grades = gs.grades
                .filter((g) => !g.isAbsent)
                .map((g) => g.grade);
              const max = Math.max(...grades);
              const min = Math.min(...grades);
              const avg = grades.length != 0 ? sum(grades) / grades.length : 0;
              return (
                <TableRow key={index}>
                  <TableCell>
                    {gs.createdAt.toLocaleDateString(locale, {
                      month: "short",
                      year: "numeric",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link
                        className="hover:underline"
                        href={`/classrooms/${gs.subject.classroomId}/gradesheets/${gs.id}`}
                      >
                        {gs.name}
                      </Link>
                      <Badge title="Saisie par" variant={"secondary"}>
                        {gs.createdBy?.username}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/classrooms/${gs.subject.classroomId}`}
                      className="hover:underline"
                    >
                      {gs.subject.classroom.reportName}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <div
                        className="size-4 rounded-full"
                        style={{
                          backgroundColor: gs.subject.course.color,
                        }}
                      ></div>
                      <Link
                        className="hover:underline"
                        href={`/classrooms/${gs.subject.classroomId}/subjects/${gs.subject.id}`}
                      >
                        {gs.subject.course.reportName}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell>{gs.term.name}</TableCell>
                  <TableCell className="text-center">
                    <Badge
                      appearance={"outline"}
                      variant={
                        grades.length != gs.grades.length
                          ? "warning"
                          : "secondary"
                      }
                    >
                      {grades.length} / {gs.grades.length}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">{min}</TableCell>
                  <TableCell className="text-center">{max}</TableCell>
                  <TableCell className="text-center">
                    <Badge
                      appearance={"outline"}
                      variant={avg < 10 ? "destructive" : "info"}
                    >
                      {avg.toFixed(2)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant={"ghost"} size={"icon"}>
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onSelect={() => {
                            router.push(
                              `/classrooms/${gs.subject.classroomId}/gradesheets/${gs.id}`,
                            );
                          }}
                        >
                          <ViewIcon />
                          {t("details")}
                        </DropdownMenuItem>
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
