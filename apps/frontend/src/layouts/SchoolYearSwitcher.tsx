"use client";

import { useTransition } from "react";

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

import { createSchoolYearCookie } from "~/actions/schoolYear";
import { api } from "~/trpc/react";

interface SchoolYearSwitcherProps {
  className?: string;
  defaultValue?: string;
}
export function SchoolYearSwitcher({ defaultValue }: SchoolYearSwitcherProps) {
  const schoolYearsQuery = api.schoolYear.all.useQuery();
  const [isUpdatePending, startUpdateTransition] = useTransition();

  const { t } = useLocale();
  if (isUpdatePending) {
    //toast.loading(t("updating"));
  }
  return (
    <Select
      defaultValue={defaultValue}
      onValueChange={(val) => {
        startUpdateTransition(() => {
          return createSchoolYearCookie(val);
        });
      }}
    >
      <SelectTrigger className="h-8 w-[180px] border-none">
        {t("year")} - <SelectValue placeholder={t("schoolYear")} />
      </SelectTrigger>
      <SelectContent>
        {schoolYearsQuery.data?.map((item) => (
          <SelectItem key={item.id} value={item.id}>
            {item.id}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
