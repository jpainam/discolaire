"use client";

import { Loader } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { useLocale } from "~/i18n";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";

export function AssignmentCategorySelector({
  defaultValue,
  onChange,
}: {
  defaultValue?: string;
  onChange?: (value: string) => void;
}) {
  const { t } = useLocale();
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
      <SelectTrigger className="w-full">
        <SelectValue placeholder={t("select_an_option")} />
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
