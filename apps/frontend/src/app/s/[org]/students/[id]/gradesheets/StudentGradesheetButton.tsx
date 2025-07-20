"use client";

import { MoreHorizontal, Pencil } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";

import { useLocale } from "~/i18n";

export function StudentGradesheetButton({
  grade,
}: {
  grade: {
    subject: string;
    grade1: number | null;
    grade2: number | null;
    grade3: number | null;
    grade4: number | null;
    grade5: number | null;
    grade6: number | null;
    observation: string;
  };
}) {
  const { t } = useLocale();
  console.log(grade);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-8" variant={"ghost"} size={"icon"}>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Pencil />
          {t("edit")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
