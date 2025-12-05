"use client";

import type { Table } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { parseAsInteger, useQueryState } from "nuqs";

import type { RouterOutputs } from "@repo/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";

import { ClassroomSelector } from "~/components/shared/selects/ClassroomSelector";
import { TermSelector } from "~/components/shared/selects/TermSelector";

type ProcedureOutput = NonNullable<
  RouterOutputs["gradeSheet"]["gradesReportTracker"]
>[number];

export function GradeReportTrackerDataTableAction({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  table,
}: {
  table: Table<ProcedureOutput>;
}) {
  const [classroomId, setClassroomId] = useQueryState("classroomId");
  const [termId, setTermId] = useQueryState("termId");
  const [count, setCount] = useQueryState("count");
  const [prevCount, setPrevCount] = useQueryState("prevCount", parseAsInteger);
  const t = useTranslations();

  return (
    <>
      <ClassroomSelector
        className="w-[300px]"
        defaultValue={classroomId ?? undefined}
        onSelect={(val) => {
          void setClassroomId(val);
        }}
      />
      <TermSelector
        className="w-[180px]"
        defaultValue={termId}
        onChange={(val) => {
          void setTermId(val);
        }}
      />
      <Select
        defaultValue={prevCount?.toString() ?? undefined}
        onValueChange={(val) => {
          void setPrevCount(
            val === "all" ? null : val == "zero" ? 0 : Number(val),
          );
        }}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">{t("all")}</SelectItem>
          <SelectItem value="zero">Zero</SelectItem>

          {Array.from({ length: 10 }).map((_, index) => (
            <SelectItem key={index} value={(index + 1).toString()}>
              {index + 1}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      /
      <Select
        defaultValue={count ?? undefined}
        onValueChange={(val) => {
          void setCount(val);
        }}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 10 }).map((_, index) => (
            <SelectItem key={index} value={(index + 1).toString()}>
              {index + 1}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
