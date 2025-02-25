"use client";

import { useLocale } from "@repo/i18n";
import { Label } from "@repo/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";

import { cn } from "~/lib/utils";

interface SelectClass {
  className?: string;
  name: string;
  label?: string;
  onChange?: (value: string) => void;
  defaultValue?: string | number;
}
export function SelectClass({
  className,
  name,
  label,
  onChange,
  defaultValue,
}: SelectClass) {
  const { t } = useLocale();
  return (
    <div className={cn("md:w-[50%] lg:w-[30%]", className)}>
      {label && <Label>{label}</Label>}
      <Select
        onValueChange={onChange}
        name={name}
        defaultValue={`${defaultValue}`}
      >
        <SelectTrigger>
          <SelectValue placeholder="Choisir la méthode de paiment" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="cash">{t("cash")}</SelectItem>
          <SelectItem value="card">{t("card")}</SelectItem>
          <SelectItem value="check">{t("check")}</SelectItem>
          <SelectItem value="emoney">{t("emoney")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
