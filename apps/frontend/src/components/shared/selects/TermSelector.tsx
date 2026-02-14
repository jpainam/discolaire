"use client";

import { useCallback } from "react";
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

interface TermSelectorProps {
  onChange?: (value: string | null) => void;
  placeholder?: string;
  className?: string;
  defaultValue?: string | null;
}

export function TermSelector({
  onChange,
  placeholder,
  className,
  defaultValue,
}: TermSelectorProps) {
  const t = useTranslations();
  const trpc = useTRPC();
  const { data: terms } = useQuery(trpc.term.all.queryOptions());

  const handleChange = useCallback(
    (value: string | null) => {
      onChange?.(value == "all" ? null : value);
    },
    [onChange],
  );

  return (
    <Select
      defaultValue={defaultValue ?? undefined}
      onValueChange={(value) => {
        handleChange(value == "all" ? null : value);
      }}
    >
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue placeholder={placeholder ?? t("select_terms")} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem key="terms-all-key" value="all">
          {t("all_terms")}
        </SelectItem>

        {terms?.map((term) => (
          <SelectItem key={term.id} value={term.id.toString()}>
            {term.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

//school.hasQuarterlyReports
