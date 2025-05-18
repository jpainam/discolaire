"use client";
import { Button } from "@repo/ui/components/button";
import { Label } from "@repo/ui/components/label";
import type {
  ImperativePanelGroupHandle,
  ImperativePanelHandle,
} from "@repo/ui/components/resizable";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@repo/ui/components/resizable";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import { Separator } from "@repo/ui/components/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/ui/components/tooltip";
import { ActivityIcon, UsersIcon, XIcon } from "lucide-react";
import type { PropsWithChildren } from "react";
import { useEffect, useRef, useState } from "react";
import { StudentActivityLog } from "./StudentActivityLog";

export function StudentMainContent(props: PropsWithChildren) {
  //const mainPanelRef = useRef<ImperativePanelHandle>(null);
  const rightPanelRef = useRef<ImperativePanelHandle>(null);
  const panelGroupRef = useRef<ImperativePanelGroupHandle>(null);

  const [activeSidePanel, setActiveSidePanel] = useState<string | null>(null);

  const toggleSidePanel = (panelId: string) => {
    const hasPanel = activeSidePanel === panelId ? null : panelId;
    console.log("hasPanel", hasPanel);
    if (hasPanel) {
      const panelGroup = panelGroupRef.current;
      if (panelGroup) {
        // Reset each Panel width
        panelGroup.setLayout([75, 25]);
      }
      //   const panel = rightPanelRef.current;
      //   if (panel) {
      //     panel.expand(30);
      //   }
    } else {
      const panelGroup = panelGroupRef.current;
      if (panelGroup) {
        // Reset each Panel width
        panelGroup.setLayout([97, 3]);
      }
    }
    setActiveSidePanel(activeSidePanel === panelId ? null : panelId);
  };
  useEffect(() => {
    const panel = rightPanelRef.current;
    if (panel) {
      panel.collapse();
    }
  }, []);

  return (
    <ResizablePanelGroup
      ref={panelGroupRef}
      autoSaveId="studentResizable"
      direction="horizontal"
    >
      <ResizablePanel defaultSize={97}>{props.children}</ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel
        collapsible={false}
        defaultSize={3}
        id="left"
        minSize={3}
        ref={rightPanelRef}
        className="flex flex-row"
      >
        <div className="flex  flex-col gap-4 bg-muted/50 p-1">
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
                <UsersIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent align="center" side="left">
              Activities
            </TooltipContent>
          </Tooltip>
        </div>
        {activeSidePanel && (
          <div className="flex flex-col border-l w-full">
            <div className="flex flex-row justify-between p-2 items-center">
              <Label>Activities</Label>
              <Button
                variant="ghost"
                size="icon"
                className="size-6"
                onClick={() => {
                  const panelGroup = panelGroupRef.current;
                  if (panelGroup) {
                    // Reset each Panel width
                    panelGroup.setLayout([97, 3]);
                  }
                  setActiveSidePanel(null);
                }}
              >
                <span className="sr-only">Close</span>
                <XIcon className="h-4 w-4" />
              </Button>
            </div>
            <Separator />
            <ScrollArea className="h-[calc(100vh-18rem)] w-full overflow-hidden">
              {activeSidePanel && <StudentActivityLog />}
            </ScrollArea>
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
