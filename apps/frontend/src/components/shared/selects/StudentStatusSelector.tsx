"use client";

import { StudentStatus } from "@repo/db";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";

import { useLocale } from "~/i18n";
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
          {t(`${StudentStatus.GRADUATED.toLowerCase()}`)}
        </SelectItem>
        <SelectItem value="INACTIVE">
          {t(`${StudentStatus.INACTIVE.toLowerCase()}`)}
        </SelectItem>
        <SelectItem value="EXPELLED">
          {t(`${StudentStatus.EXPELLED.toLowerCase()}`)}
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
