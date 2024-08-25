"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Forward, MoreVertical, Printer, Reply, RotateCw } from "lucide-react";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { Separator } from "@repo/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@repo/ui/tooltip";

import { ClassroomSelector } from "~/components/shared/selects/ClassroomSelector";
import { cn } from "~/lib/utils";
import { LeftPanelButton, RightPanelButton } from "../resize-panel-buttons";
import { AddStudenSheet } from "./add-student-sheet";

export function StudentsToolbar() {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const classroomId = searchParams.get("classroomId");
  /*const [isLoading, setIsLoading] = useState(false);*/

  useEffect(() => {
    //setClassroomId(null);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex items-center p-2">
      <div className="flex items-center gap-2">
        <LeftPanelButton />
        <p className="text-sm text-muted-foreground"></p>
        <Tooltip>
          <TooltipTrigger asChild>
            <ClassroomSelector
              onChange={(val) => {
                //setClassroomId(val ?? null);
              }}
            />
          </TooltipTrigger>
          <TooltipContent>Archive</TooltipContent>
        </Tooltip>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <AddStudenSheet />
          </TooltipTrigger>
          <TooltipContent>{t("add")}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon">
              <Printer className="h-4 w-4" />
              <span className="sr-only">{t("print")}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("print")}</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon">
              <Reply className="h-4 w-4" />
              <span className="sr-only">{t("prev")}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("prev")}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon">
              <Forward className="h-4 w-4" />
              <span className="sr-only">{t("next")}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("next")}</TooltipContent>
        </Tooltip>
      </div>
      <Separator orientation="vertical" className="mx-2 h-6" />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button onClick={() => {}} variant="ghost" size="icon">
            <RotateCw className={cn("h-4 w-4 animate-spin")} />
            <span className="sr-only">{t("reload")}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t("reload")}</TooltipContent>
      </Tooltip>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">More</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>{t("plus")}</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <RightPanelButton />
    </div>
  );
}
