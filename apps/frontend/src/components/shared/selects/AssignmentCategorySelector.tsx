"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
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

export function AssignmentCategorySelector({
  defaultValue,
  className,
  onChange,
}: {
  defaultValue?: string;
  className?: string;
  onChange?: (value: string) => void;
}) {
  const t = useTranslations();
  const trpc = useTRPC();
  const assignmentCategoriesQuery = useQuery(
    trpc.assignment.categories.queryOptions(),
  );
  return (
    <Select
      onValueChange={(value) => {
        onChange?.(value);
      }}
      defaultValue={defaultValue}
    >
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue placeholder={t("Select a category")} />
      </SelectTrigger>
      <SelectContent>
        {assignmentCategoriesQuery.isPending && (
          <SelectItem value="0">
            <Loader className="w-8 animate-spin" />
          </SelectItem>
        )}
        {assignmentCategoriesQuery.data?.map((cat) => (
          <SelectItem key={cat.id.toString()} value={cat.id.toString()}>
            {cat.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
