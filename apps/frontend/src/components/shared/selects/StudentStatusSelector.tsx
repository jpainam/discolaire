"use client";

import { useTranslations } from "next-intl";

import { StudentStatus } from "@repo/db/enums";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
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
  const t = useTranslations();
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
