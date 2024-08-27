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

interface RelationshipSelectorProps {
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  defaultValue?: string | null;
  showAllOption?: boolean;
}
export function RelationshipSelector({
  onChange,
  placeholder,
  className,
  defaultValue,
  showAllOption = true,
}: RelationshipSelectorProps) {
  const { t } = useLocale();

  const relationshipsQuery = api.studentContact.relationships.useQuery();

  return (
    <Select
      defaultValue={defaultValue ?? undefined}
      onValueChange={(value) => {
        onChange?.(value == "all" ? "" : value);
      }}
    >
      {!relationshipsQuery.isPending ? (
        <SelectTrigger className={cn(className)}>
          <SelectValue placeholder={placeholder ?? t("select_relationship")} />
        </SelectTrigger>
      ) : (
        <Skeleton className={cn("h-8 w-full", className)} />
      )}
      <SelectContent>
        {relationshipsQuery.isPending && (
          <SelectItem disabled value={"loading"}>
            <Skeleton className="h-8 w-full" />
          </SelectItem>
        )}
        {showAllOption && (
          <SelectItem key={"relationship-all-key"} value="all">
            {t("all_relationships")}
          </SelectItem>
        )}
        {relationshipsQuery.data?.map((relationship) => {
          return (
            <SelectItem
              key={relationship.id}
              value={relationship.id.toString()}
            >
              {relationship.name}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
