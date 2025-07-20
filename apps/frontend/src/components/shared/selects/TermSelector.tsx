"use client";

import { useCallback } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";

import { useLocale } from "~/i18n";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";

interface TermSelectorProps {
  onChange?: (value?: string | null) => void;
  placeholder?: string;
  className?: string;
  defaultValue?: string | null;
  showAllOption?: boolean;
}

export function TermSelector({
  onChange,
  placeholder,
  className,
  defaultValue,
  showAllOption = true,
}: TermSelectorProps) {
  const { t } = useLocale();
  const trpc = useTRPC();
  const { data: terms } = useSuspenseQuery(trpc.term.all.queryOptions());

  const handleChange = useCallback(
    (value: string | null) => {
      onChange?.(value == "all" ? undefined : value);
    },
    [onChange],
  );

  return (
    <Select
      defaultValue={defaultValue ?? undefined}
      onValueChange={(value) => {
        handleChange(value);
      }}
    >
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue placeholder={placeholder ?? t("select_terms")} />
      </SelectTrigger>
      <SelectContent>
        {showAllOption && (
          <SelectItem key="terms-all-key" value="all">
            {t("all_terms")}
          </SelectItem>
        )}
        {terms.map((term) => (
          <SelectItem key={term.id} value={term.id.toString()}>
            {term.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
