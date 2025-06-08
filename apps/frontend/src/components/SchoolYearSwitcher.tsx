"use client";

//import { setSchoolYearSession } from "@repo/auth/session";
import { useLocale } from "~/i18n";
//import { useConfig } from "@repo/hooks/use-config";
//import { Style, styles } from "~/registry/styles";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { useSuspenseQuery } from "@tanstack/react-query";
import { setSchoolYearCookie } from "~/actions/signin";
import { useTRPC } from "~/trpc/react";
interface SchoolYearSwitcherProps {
  className?: string;
  defaultValue: string;
}
export function SchoolYearSwitcher({ defaultValue }: SchoolYearSwitcherProps) {
  const { t } = useLocale();
  const trpc = useTRPC();
  const { data: schoolYears } = useSuspenseQuery(
    trpc.schoolYear.all.queryOptions(),
  );

  return (
    <Select
      defaultValue={defaultValue}
      onValueChange={(val) => {
        void setSchoolYearCookie(val);
      }}
    >
      <SelectTrigger
        id="year-selector"
        size="sm"
        className="h-7 justify-start *:data-[slot=select-value]:w-fit "
      >
        <span className="text-muted-foreground hidden sm:block">
          {t("year")}:
        </span>
        <span className="text-muted-foreground block sm:hidden">
          {t("year")}
        </span>

        <SelectValue placeholder={t("school_year")} />
      </SelectTrigger>
      <SelectContent>
        {schoolYears.map((item, index) => {
          return (
            <SelectItem key={index} value={item.id}>
              {item.name}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
