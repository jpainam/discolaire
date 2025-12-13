"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";

export function SubjectProgramSelector({
  defaultValue,
  onSelectAction,
  subjectId,
  className,
}: {
  defaultValue?: string;
  subjectId: number;
  className?: string;
  onSelectAction?: (val: string) => void;
}) {
  const trpc = useTRPC();
  const programQuery = useQuery(
    trpc.subjectProgram.programs.queryOptions({ subjectId }),
  );
  const programs = programQuery.data;
  const t = useTranslations();
  return (
    <Select
      defaultValue={defaultValue}
      onValueChange={(val) => onSelectAction?.(val)}
    >
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue placeholder={t("course_coverage")} />
      </SelectTrigger>
      <SelectContent>
        {programs?.map((p, index) => (
          <SelectItem key={index} value={p.id}>
            {p.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
