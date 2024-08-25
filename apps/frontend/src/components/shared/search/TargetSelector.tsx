"use client";

import { useAtom } from "jotai/react";

import { useLocale } from "@repo/i18n";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";

import { peopleCriteriaAtom } from "~/atoms/use-criteria";

export function TargetSelector() {
  const { t } = useLocale();
  const selectTargetOptions = [
    { label: t("all"), value: "all" },
    { label: t("students"), value: "students" },
    { label: t("teachers"), value: "teachers" },
    { label: t("staffs"), value: "staffs" },
    { label: t("parents"), value: "parents" },
  ];
  const [criteria, setCriteria] = useAtom(peopleCriteriaAtom);
  return (
    <Select
      onValueChange={(val) => {
        setCriteria((prev) => ({ ...prev, target: val }));
      }}
      defaultValue={criteria.target}
    >
      <SelectTrigger className="h-8 w-[180px]">
        <SelectValue placeholder={t("all")} />
      </SelectTrigger>
      <SelectContent>
        {selectTargetOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
