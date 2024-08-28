"use client";

//import { useConfig } from "@repo/hooks/use-config";
//import { Style, styles } from "~/registry/styles";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";

import { api } from "~/trpc/react";

interface SchoolYearSwitcherProps {
  className?: string;
  currentSchoolYear?: string;
}
export function SchoolYearSwitcher({
  currentSchoolYear,
}: SchoolYearSwitcherProps) {
  const schoolYearsQuery = api.schoolYear.all.useQuery();

  const [value, setValue] = useState(currentSchoolYear);
  const { t } = useLocale();

  //const classroomsQuery = api.classroom.all.useQuery();
  const setSchoolYearCookieMutation = api.schoolYear.setAsCookie.useMutation();

  const recentYear = schoolYearsQuery.data?.[0]?.id;
  //const defaultValue = currentSchoolYear ?? recentYear;

  if (!currentSchoolYear && recentYear) {
    setSchoolYearCookieMutation.mutate(recentYear);
  }

  const handleOnChange = (val: string) => {
    setValue(val);
    setSchoolYearCookieMutation.mutate(val);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"ghost"}
          size={"sm"}
          className="flex items-center gap-2 hover:bg-transparent hover:text-primary-foreground hover:dark:text-primary"
        >
          <span className="text-muted-foreground">{t("year")}</span>
          <span>{value}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-14">
        {schoolYearsQuery.data?.map((item) => (
          <DropdownMenuItem
            key={item.id}
            onSelect={() => handleOnChange(item.id)}
          >
            <span className="text-xs">{item.id}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
