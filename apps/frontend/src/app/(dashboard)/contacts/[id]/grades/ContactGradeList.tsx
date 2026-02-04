"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MoreHorizontal, Search } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useQueryState } from "nuqs";
import { useDebouncedCallback } from "use-debounce";

import type { RouterOutputs } from "@repo/api";

import { Badge } from "~/components/base-badge";
import { EmptyComponent } from "~/components/EmptyComponent";
import {
  MetricCardButton,
  MetricCardGroup,
  MetricCardHeader,
  MetricCardTitle,
  MetricCardValue,
} from "~/components/metric-card";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useRouter } from "~/hooks/use-router";
import { GradeIcon, TextBookIcon, ViewIcon } from "~/icons";
import { getFullName } from "~/utils";
import { getAppreciations } from "~/utils/appreciations";

export function ContactGradeList({
  grades,
  studentContacts,
}: {
  grades: RouterOutputs["student"]["grades"];
  studentContacts: RouterOutputs["contact"]["students"];
}) {
  const locale = useLocale();
  const [termId, setTermId] = useQueryState("termId");
  const [studentId, setStudentId] = useQueryState("studentId");
  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearchText(value);
  }, 300);
  const studentsMap = useMemo(() => {
    return new Map<
      string,
      { name: string; id: string; classroom?: string; classroomId?: string }
    >(
      studentContacts.map((std) => [
        std.studentId,
        {
          name: getFullName(std.student),
          id: std.studentId,
          classroom: std.student.classroom?.name,
          classroomId: std.student.classroom?.id,
        },
      ]),
    );
  }, [studentContacts]);
  const filtered = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    return grades.filter((g) => {
      if (studentId && g.studentId !== studentId) return false;
      if (termId && g.gradeSheet.termId !== termId) return false;
      if (!query) return true;
      const student = studentsMap.get(g.studentId);
      const haystack = [
        student?.name,
        student?.classroom,
        g.grade.toString(),
        g.gradeSheet.term.name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [grades, searchText, studentId, studentsMap, termId]);
  const { max, min, maxCourseName, minCourseName } = useMemo(() => {
    if (filtered.length === 0) {
      return { max: 0, min: 0, maxCourseName: "", minCourseName: "" };
    }
    let maxValue = filtered[0]?.grade ?? 0;
    let minValue = filtered[0]?.grade ?? 0;
    let maxCourse = filtered[0]?.gradeSheet.subject.course.shortName ?? "";
    let minCourse = filtered[0]?.gradeSheet.subject.course.shortName ?? "";
    for (let i = 1; i < filtered.length; i += 1) {
      const grade = filtered[i]?.grade ?? 0;
      if (grade > maxValue) {
        maxValue = grade;
        maxCourse = filtered[i]?.gradeSheet.subject.course.shortName ?? "";
      }
      if (grade < minValue) {
        minValue = grade;
        minCourse = filtered[i]?.gradeSheet.subject.course.shortName ?? "";
      }
    }
    return {
      max: maxValue,
      min: minValue,
      maxCourseName: maxCourse,
      minCourseName: minCourse,
    };
  }, [filtered]);
  const t = useTranslations();
  const router = useRouter();

  return (
    <div className="flex flex-col gap-2 px-4 py-2">
      <div className="flex items-center gap-4">
        <Label>{t("grades")}</Label>
      </div>
      <div>
        <MetricCardGroup>
          <MetricCardButton variant={"success"}>
            <MetricCardHeader className="flex w-full items-center justify-between gap-2">
              <MetricCardTitle className="truncate">
                Plus forte note
              </MetricCardTitle>
              <GradeIcon />
            </MetricCardHeader>

            <MetricCardValue className="flex items-center justify-between">
              <span>{max.toFixed(2)}</span>
              <span className="text-muted-foreground text-xs">
                {maxCourseName}
              </span>
            </MetricCardValue>
          </MetricCardButton>
          <MetricCardButton variant={"destructive"}>
            <MetricCardHeader className="flex w-full items-center justify-between gap-2">
              <MetricCardTitle className="truncate">
                La plus petite note
              </MetricCardTitle>
              <TextBookIcon />
            </MetricCardHeader>

            <MetricCardValue className="flex items-center justify-between">
              <span>{min.toFixed(2)}</span>
              <span className="text-muted-foreground text-xs">
                {minCourseName}
              </span>
            </MetricCardValue>
          </MetricCardButton>
        </MetricCardGroup>
      </div>
      <div className="grid grid-cols-1 items-center gap-4 xl:flex">
        <div className="flex flex-1 flex-col gap-2">
          <Label>{t("search")}</Label>
          <InputGroup>
            <InputGroupInput
              placeholder={t("search")}
              onChange={(event) => debouncedSearch(event.target.value)}
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>
        </div>
        <div className="flex flex-col gap-2">
          <Label>{t("student")}</Label>
          <Select
            onValueChange={(value) => {
              void setStudentId(value);
            }}
          >
            <SelectTrigger className="w-full xl:w-[300px]">
              <SelectValue placeholder={t("students")} />
            </SelectTrigger>
            <SelectContent>
              {studentContacts.map((std) => {
                return (
                  <SelectItem key={std.studentId} value={std.studentId}>
                    {getFullName(std.student)}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label>{t("terms")}</Label>
          <TermSelector
            className="w-full xl:w-[300px]"
            onChange={(value) => {
              void setTermId(value);
            }}
          />
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border bg-transparent">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>{t("fullName")}</TableHead>
              <TableHead className="text-center">{t("classroom")}</TableHead>
              <TableHead className="text-center">{t("term")}</TableHead>
              <TableHead>{t("Label")}</TableHead>
              <TableHead>{t("course")}</TableHead>
              <TableHead className="text-center">{t("grade")}</TableHead>
              <TableHead className="text-center">{t("created_at")}</TableHead>
              <TableHead>Appr</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length == 0 ? (
              <TableRow>
                <TableCell colSpan={8}>
                  <EmptyComponent
                    title="Aucune notes"
                    description="Adjuster votre critère de recherche"
                  />
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((grade) => {
                const student = studentsMap.get(grade.studentId);
                return (
                  <TableRow key={grade.id}>
                    <TableCell>
                      <Link
                        className="hover:underline"
                        href={`/students/${grade.studentId}`}
                      >
                        {student?.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-center">
                      <Link
                        href={`/classroom/${student?.classroomId}`}
                        className="text-muted-foreground hover:underline"
                      >
                        {student?.classroom}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-center">
                      {grade.gradeSheet.term.name}
                    </TableCell>
                    <TableCell>{grade.gradeSheet.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Link
                          className="hover:underline"
                          href={`/classrooms/${grade.gradeSheet.subject.classroomId}/subjects/${grade.gradeSheet.subjectId}`}
                        >
                          {grade.gradeSheet.subject.course.reportName}
                        </Link>
                        /
                        <Link
                          className="hover:underline"
                          href={`/staffs/${grade.gradeSheet.subject.teacherId}`}
                        >
                          {grade.gradeSheet.subject.teacher?.lastName ??
                            grade.gradeSheet.subject.teacher?.firstName}
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        appearance={"light"}
                        variant={
                          grade.grade < 10
                            ? "destructive"
                            : grade.grade < 15
                              ? "info"
                              : "success"
                        }
                      >
                        {grade.grade.toFixed(2)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {grade.gradeSheet.createdAt.toLocaleDateString(locale, {
                        year: "numeric",
                        day: "numeric",
                        month: "short",
                      })}
                    </TableCell>
                    <TableCell>{getAppreciations(grade.grade)}</TableCell>
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
                                `/students/${grade.studentId}/grades?gradeId=${grade.id}&gradesheetId=${grade.gradeSheetId}`,
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
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
