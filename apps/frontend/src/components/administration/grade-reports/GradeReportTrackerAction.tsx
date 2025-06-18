"use client";
import type { RouterOutputs } from "@repo/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import type { Table } from "@tanstack/react-table";
import { useLocale } from "~/i18n";

import { RiFilter3Line } from "@remixicon/react";
import { Skeleton } from "@repo/ui/components/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";

type ProcedureOutput = NonNullable<
  RouterOutputs["gradeSheet"]["gradesReportTracker"]
>[number];

export function GradeReportTrackerDataTableAction({
  table,
}: {
  table: Table<ProcedureOutput>;
}) {
  const { t } = useLocale();
  const trpc = useTRPC();
  const classroomQuery = useQuery(trpc.classroom.all.queryOptions());
  const termQuery = useQuery(trpc.term.all.queryOptions());

  // Extract complex expressions into separate variables
  console.log(table.getAllColumns().map((col) => col.id));
  const classroomColumn = table.getColumn("subject_classroom_name");
  const termColumn = table.getColumn("terms");
  console.log("Classroom Column:", classroomColumn);
  console.log("Faceted Term Column:", termColumn?.getFacetedUniqueValues());

  const cycleFacetedValues = classroomColumn?.getFacetedUniqueValues();
  console.log("Cycle Faceted Values:", cycleFacetedValues);
  const cycleFilterValue = classroomColumn?.getFilterValue();
  console.log("Cycle Filter Value:", cycleFilterValue);

  //   // Update useMemo hooks with simplified dependencies
  //   const uniqueStatusValues = useMemo(() => {
  //     if (!cycleColumn) return [];
  //     const values = Array.from(cycleFacetedValues?.keys() ?? []);
  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  //     return values.sort();
  //   }, [cycleColumn, cycleFacetedValues]);

  //   const selectedStatuses = useMemo(() => {
  //     return new Set((cycleFilterValue as string[]) ?? []);
  //   }, [cycleFilterValue]);

  //   const statusCounts = useMemo(() => {
  //     if (!cycleColumn) return new Map();
  //     return cycleFacetedValues ?? new Map();
  //   }, [cycleColumn, cycleFacetedValues]);

  if (classroomQuery.isPending) {
    return <Skeleton className="h-6 w-32" />;
  }
  return (
    <div className="flex items-center gap-2">
      <RiFilter3Line
        className="size-5 -ms-1.5 text-muted-foreground/60"
        size={20}
        aria-hidden="true"
      />
      <Select
        onValueChange={(value) => {
          classroomColumn?.setFilterValue(value);
        }}
      >
        <SelectTrigger size="sm" className="w-[200px] text-xs h-7">
          <SelectValue placeholder={t("terms")} />
        </SelectTrigger>
        <SelectContent>
          {termQuery.data?.map((term) => (
            <SelectItem
              className="text-xs"
              value={`${term.name}`}
              key={term.id}
            >
              {term.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select defaultValue="1">
        <SelectTrigger
          size="sm"
          className="text-xs [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0 h-7 w-[150px]"
        >
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent className="[&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]>span>svg]:shrink-0">
          <SelectItem value="1">
            <span className="flex items-center gap-2">
              <StatusDot className="text-emerald-600" />
              <span className="truncate text-xs">{t("Completed")}</span>
            </span>
          </SelectItem>
          <SelectItem value="5">
            <span className="flex items-center gap-2">
              <StatusDot className="text-red-500" />
              <span className="truncate text-xs">{t("In Progress")}</span>
            </span>
          </SelectItem>
        </SelectContent>
      </Select>
      <Select
        onValueChange={(value) => {
          classroomColumn?.setFilterValue(value);
        }}
      >
        <SelectTrigger size="sm" className="w-[200px] text-xs h-7">
          <SelectValue placeholder={t("classrooms")} />
        </SelectTrigger>
        <SelectContent>
          {classroomQuery.data?.map((classroom) => (
            <SelectItem
              className="text-xs"
              value={`${classroom.name}`}
              key={classroom.id}
            >
              {classroom.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function StatusDot({ className }: { className?: string }) {
  return (
    <svg
      width="8"
      height="8"
      fill="currentColor"
      viewBox="0 0 8 8"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="4" cy="4" r="4" />
    </svg>
  );
}
