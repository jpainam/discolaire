"use client";

import { useLocale } from "@repo/i18n";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { Skeleton } from "@repo/ui/skeleton";

import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

interface TermSelectorProps {
  onChange?: (value: string) => void;
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

  return (
    <Select
      defaultValue={defaultValue ?? undefined}
      onValueChange={(value) => {
        onChange?.(value == "all" ? "" : value);
      }}
    >
      {!termsQuery.isPending ? (
        <SelectTrigger className={cn(className)}>
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
