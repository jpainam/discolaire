"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { Skeleton } from "@repo/ui/components/skeleton";
import { useCallback } from "react";
import { useLocale } from "~/i18n";

import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

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

  const termsQuery = api.term.all.useQuery();
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
      {!termsQuery.isPending ? (
        <SelectTrigger className={cn("w-full", className)}>
          <SelectValue placeholder={placeholder ?? t("select_terms")} />
        </SelectTrigger>
      ) : (
        <Skeleton className={cn("h-8 w-full", className)} />
      )}
      <SelectContent>
        {termsQuery.isPending && (
          <SelectItem disabled value={"loading"}>
            <Skeleton className="h-8 w-full" />
          </SelectItem>
        )}
        {showAllOption && (
          <SelectItem key={"terms-all-key"} value="all">
            {t("all_terms")}
          </SelectItem>
        )}
        {termsQuery.data?.map((term) => {
          return (
            <SelectItem key={term.id} value={term.id.toString()}>
              {term.name}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
