"use client";

import { Button } from "@repo/ui/components/button";
import { Label } from "@repo/ui/components/label";
import { Separator } from "@repo/ui/components/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/ui/components/tooltip";
import { cn } from "@repo/ui/lib/utils";
import { ActivityIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { useLocale } from "~/i18n";
import { StudentActivityLog } from "./StudentActivityLog";
export function StudentRightSidebar() {
  const [activeSidePanel, setActiveSidePanel] = useState<string | null>(null);
  const toggleSidePanel = (panelId: string) => {
    setActiveSidePanel(activeSidePanel === panelId ? null : panelId);
  };
  const { t } = useLocale();
  return (
    <div
      className={cn(
        "flex transition-transform duration-300 ease-in-out",
        activeSidePanel ? "translate-x-0" : "",
      )}
    >
      <div className="bg-muted/50 p-1 flex flex-col gap-2 border-l">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => toggleSidePanel("1")}
              variant={activeSidePanel === "1" ? "default" : "outline"}
              size={"icon"}
              className="size-8"
            >
              <ActivityIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent align="center" side="left">
            Activities
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => toggleSidePanel("2")}
              variant={activeSidePanel === "2" ? "default" : "outline"}
              size={"icon"}
              className="size-8"
            >
              <ActivityIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent align="center" side="left">
            Activities
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => toggleSidePanel("3")}
              variant={activeSidePanel === "3" ? "default" : "outline"}
              size={"icon"}
              className="size-8"
            >
              <ActivityIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent align="center" side="left">
            Activities
          </TooltipContent>
        </Tooltip>
      </div>
      <div
        className={cn(
          "border-l  transition-all duration-300 ease-in-out",
          activeSidePanel
            ? "opacity-100 h-[calc(100%-30rem)]"
            : "w-0 opacity-0 overflow-hidden",
        )}
      >
        {activeSidePanel && (
          <>
            <div className="flex flex-row items-center justify-between">
              <Label>{t("activities")}</Label>
              <Button variant={"ghost"} className="size-8">
                <XIcon className="h-4 w-4" />
              </Button>
            </div>
            <Separator />
            {activeSidePanel === "1" && <StudentActivityLog />}
          </>
        )}
      </div>
    </div>
  );
}
