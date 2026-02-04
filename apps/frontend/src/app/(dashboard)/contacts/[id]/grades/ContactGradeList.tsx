"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";

import type { RouterOutputs } from "@repo/api";

import { Badge } from "~/components/base-badge";
import {
  MetricCardButton,
  MetricCardGroup,
  MetricCardHeader,
  MetricCardTitle,
  MetricCardValue,
} from "~/components/metric-card";
import { TermSelector } from "~/components/shared/selects/TermSelector";
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
import { GradeIcon } from "~/icons";
import { getFullName } from "~/utils";
import { getAppreciations } from "~/utils/appreciations";

export function ContactGradeList({
  grades,
  studentContacts,
}: {
  grades: RouterOutputs["student"]["grades"];
  studentContacts: RouterOutputs["contact"]["students"];
}) {
  const [termId, setTermId] = useQueryState("termId");
  const [studentId, setStudentId] = useQueryState("studentId");
  const filtered = useMemo(() => {
    if (!termId || !studentId) return grades;
    const ggs = studentId
      ? grades.filter((g) => g.studentId == studentId)
      : grades;
    return termId ? ggs.filter((g) => g.gradeSheet.termId == termId) : ggs;
  }, [grades, termId, studentId]);
  const studentsMap = new Map<
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
  const { max, min } = useMemo(() => {
    return {
      max: Math.max(...filtered.map((f) => f.grade)),
      min: Math.min(...filtered.map((f) => f.grade)),
    };
  }, [filtered]);
  const t = useTranslations();

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
            </MetricCardValue>
          </MetricCardButton>
          <MetricCardButton variant={"destructive"}>
            <MetricCardHeader className="flex w-full items-center justify-between gap-2">
              <MetricCardTitle className="truncate">
                La plus petite note
              </MetricCardTitle>
              <GradeIcon />
            </MetricCardHeader>

            <MetricCardValue className="flex items-center justify-between">
              <span>{min.toFixed(2)}</span>
            </MetricCardValue>
          </MetricCardButton>
        </MetricCardGroup>
      </div>
      <div className="grid grid-cols-1 items-center gap-4 xl:flex">
        <div className="flex flex-1 flex-col gap-2">
          <Label>{t("search")}</Label>
          <InputGroup>
            <InputGroupInput placeholder={t("search")} />
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
              <TableHead>{t("grade")}</TableHead>
              <TableHead>Appr</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((grade) => {
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
                  <TableCell>
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
                  <TableCell>{getAppreciations(grade.grade)}</TableCell>
                  <TableCell className="text-right">.00</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
