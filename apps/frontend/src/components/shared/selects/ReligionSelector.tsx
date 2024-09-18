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

interface ReligionSelectorProps {
  className?: string;
  defaultValue?: string | null;
  onChange?: (value: string) => void;
}
export function ReligionSelector({
  className,
  onChange,
  defaultValue,
}: ReligionSelectorProps) {
  const { t } = useLocale();
  const religionsQuery = api.religion.all.useQuery();
  if (religionsQuery.error) {
    toast.error(religionsQuery.error.message);
  }
  return (
    <Select
      defaultValue={defaultValue ?? undefined}
      onValueChange={(val) => {
        onChange?.(val);
      }}
    >
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue placeholder={t("religion")} />
      </SelectTrigger>
      <SelectContent>
        {religionsQuery.data?.map((religion) => (
          <SelectItem key={religion.id} value={religion.id}>
            {religion.name}
          </SelectItem>
        ))}
        {religionsQuery.isPending && (
          <SelectItem value="loading">
            <Loader className="h-4 w-4 animate-spin" />
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
}
