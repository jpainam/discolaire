"use client";

import { StudentStatus } from "@repo/db";
import { useLocale } from "@repo/i18n";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";

import { cn } from "~/lib/utils";

interface StudentStatusSelectorProps {
  onChange?: (value: StudentStatus) => void;

  className?: string;
  defaultValue?: StudentStatus | null;
}
export function StudentStatusSelector({
  onChange,
  className,
  defaultValue,
}: StudentStatusSelectorProps) {
  const { t } = useLocale();
  return (
    <Select
      defaultValue={defaultValue ?? undefined}
      onValueChange={(val) => {
        onChange?.(val as StudentStatus);
      }}
    >
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue placeholder={t("status")} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ACTIVE">{t(`${StudentStatus.ACTIVE}`)}</SelectItem>
        <SelectItem value="GRADUATED">
          {t(`${StudentStatus.GRADUATED}`)}
        </SelectItem>
        <SelectItem value="INACTIVE">
          {t(`${StudentStatus.INACTIVE}`)}
        </SelectItem>
        <SelectItem value="EXPELLED">
          {t(`${StudentStatus.EXPELLED}`)}
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
