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

type JournalSelectorProps = {
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  defaultValue?: string | null;
  showAllOption?: boolean;
};
export function JournalSelector({
  onChange,
  placeholder,
  className,
  defaultValue,
  showAllOption = true,
}: JournalSelectorProps) {
  const { t } = useLocale();

  const journalsQuery = api.journal.all.useQuery();

  return (
    <Select
      defaultValue={defaultValue || undefined}
      onValueChange={(value) => {
        onChange && onChange(value == "All" ? "" : value);
      }}
    >
      {!journalsQuery.isPending ? (
        <SelectTrigger className={cn(className)}>
          <SelectValue placeholder={placeholder ?? t("select_terms")} />
        </SelectTrigger>
      ) : (
        <Skeleton className={cn("h-10 w-full", className)} />
      )}
      <SelectContent>
        {journalsQuery.isPending && (
          <SelectItem disabled value={"loading"}>
            <Skeleton className="h-10 w-full" />
          </SelectItem>
        )}
        {showAllOption && (
          <SelectItem key={"terms-all-key"} value="All">
            {t("all")}
          </SelectItem>
        )}
        {journalsQuery?.data?.map((journal) => {
          return (
            <SelectItem key={journal.id} value={journal.id.toString()}>
              {journal.name}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
