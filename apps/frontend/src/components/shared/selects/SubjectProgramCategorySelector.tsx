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
} from "~/components/ui/select";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";

export function SubjectProgramCategorySelector({
  onChangeAction,
  defaultValue,
  className,
}: {
  onChangeAction?: (value: string) => void;
  defaultValue?: string;
  className?: string;
}) {
  const t = useTranslations();
  const trpc = useTRPC();
  const categoriesQuery = useQuery(trpc.term.all.queryOptions());
  return (
    <Select
      onValueChange={(val) => {
        if (val === "all") {
          onChangeAction?.("");
        } else {
          onChangeAction?.(val);
        }
      }}
      defaultValue={defaultValue}
    >
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue placeholder={t("select_an_option")} />
      </SelectTrigger>
      <SelectContent>
        {categoriesQuery.isPending ? (
          <SelectItem value="loading" disabled>
            <Loader2 className="h-4 w-4 animate-spin" />
          </SelectItem>
        ) : (
          <>
            <SelectItem value="all">{t("all")}</SelectItem>
            {categoriesQuery.data?.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </>
        )}
      </SelectContent>
    </Select>
  );
}
