"use client";

//import { setSchoolYearSession } from "@repo/auth/session";
import { useLocale } from "~/i18n";
//import { useConfig } from "@repo/hooks/use-config";
//import { Style, styles } from "~/registry/styles";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";
import { Check, ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { setSchoolYearCookie } from "~/actions/signin";

interface SchoolYearSwitcherProps {
  className?: string;
  defaultValue: string;
  schoolYears: RouterOutputs["schoolYear"]["all"];
}
export function SchoolYearSwitcher({
  defaultValue,
  schoolYears,
}: SchoolYearSwitcherProps) {
  const { t } = useLocale();
  const [value, setValue] = useState<string>(defaultValue);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"ghost"}
          size={"sm"}
          className={cn("rounded-lg hover:bg-transparent")}
        >
          {t("year")} - {schoolYears.find((item) => item.id === value)?.name}
          <ChevronDownIcon size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {schoolYears.map((item) => {
          return (
            <DropdownMenuItem
              onSelect={() => {
                setValue(item.id);
                void setSchoolYearCookie(item.id);
              }}
              key={item.id}
            >
              {item.name}
              {item.id === defaultValue && <Check size={16} />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
