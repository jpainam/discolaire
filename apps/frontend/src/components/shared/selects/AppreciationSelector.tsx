"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { Skeleton } from "@repo/ui/components/skeleton";
import { useLocale } from "~/i18n";

import { useQuery } from "@tanstack/react-query";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";

interface AppreciationSelectorProps {
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  defaultValue?: string | null;
  showAllOption?: boolean;
}
export function AppreciationSelector({
  onChange,
  placeholder,
  className,
  defaultValue,
  showAllOption = true,
}: AppreciationSelectorProps) {
  const { t } = useLocale();
  const trpc = useTRPC();
  const termsQuery = useQuery(trpc.term.all.queryOptions());

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
