"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { cn } from "@repo/ui/lib/utils";

import { useTRPC } from "~/trpc/react";

export function AccountingJournalSelector({
  onChange,
  defaultValue,
  className,
}: {
  onChange?: (value: string | null) => void;
  defaultValue?: string;
  className?: string;
}) {
  const t = useTranslations();
  const trpc = useTRPC();
  const journalQuery = useQuery(trpc.accountingJournal.all.queryOptions());
  return (
    <Select
      onValueChange={(val) => {
        onChange?.(val == "all" ? null : val);
      }}
      defaultValue={defaultValue}
    >
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue placeholder={t("Accounting Journals")} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{t("all")}</SelectItem>
        {journalQuery.isPending ? (
          <SelectItem value="loading" disabled>
            <Loader2 className="h-4 w-4 animate-spin" />
          </SelectItem>
        ) : (
          journalQuery.data?.map((journal) => (
            <SelectItem key={journal.id} value={journal.id}>
              {journal.name}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
