"use client";

import { useLocale } from "@repo/i18n";
//import { useConfig } from "@repo/hooks/use-config";
//import { Style, styles } from "~/registry/styles";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";

import { api } from "~/trpc/react";

interface SchoolYearSwitcherProps {
  className?: string;
  defaultValue?: string;
}
export function SchoolYearSwitcher({ defaultValue }: SchoolYearSwitcherProps) {
  const schoolYearsQuery = api.schoolYear.all.useQuery();
  const { t } = useLocale();
  const schoolYearCookieMutation = api.schoolYear.setAsCookie.useMutation();
  return (
    <Select
      defaultValue={defaultValue}
      onValueChange={(val) => {
        schoolYearCookieMutation.mutate(val);
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={t("schoolYear")} />
      </SelectTrigger>
      <SelectContent>
        {schoolYearsQuery.data?.map((item) => (
          <SelectItem value={item.id}>{item.id}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
