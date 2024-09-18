"use client";

import { Loader } from "lucide-react";
import { toast } from "sonner";

import { useLocale } from "@repo/i18n";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";

import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

interface DenominationSelectorProps {
  className?: string;
  defaultValue?: string | null;
  onChange?: (value: string) => void;
}
export function DenominationSelector({
  className,
  onChange,
  defaultValue,
}: DenominationSelectorProps) {
  const { t } = useLocale();
  const denominationsQuery = api.denomination.all.useQuery();
  if (denominationsQuery.error) {
    toast.error(denominationsQuery.error.message);
  }
  return (
    <Select
      defaultValue={defaultValue ?? undefined}
      onValueChange={(val) => {
        onChange?.(val);
      }}
    >
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue placeholder={t("denomination")} />
      </SelectTrigger>
      <SelectContent>
        {denominationsQuery.data?.map((denomination) => (
          <SelectItem key={denomination.id} value={denomination.id}>
            {denomination.name}
          </SelectItem>
        ))}
        {denominationsQuery.isPending && (
          <SelectItem value="loading">
            <Loader className="h-4 w-4 animate-spin" />
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
}
