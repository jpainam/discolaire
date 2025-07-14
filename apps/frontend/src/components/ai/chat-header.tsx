"use client";

import { useRouter } from "next/navigation";
import { useWindowSize } from "usehooks-ts";

import type { Session } from "@repo/auth";
import type { VisibilityType } from "@repo/db";
import { Button } from "@repo/ui/components/button";
import { useSidebar } from "@repo/ui/components/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/ui/components/tooltip";
import { memo } from "react";
import { ModelSelector } from "~/components/ai/model-selector";
import { PlusIcon, SidebarLeftIcon } from "./icons";
import { VisibilitySelector } from "./visibility-selector";

function PureChatHeader({
  chatId,
  selectedModelId,
  selectedVisibilityType,
  isReadonly,
  session,
}: {
  chatId: string;
  selectedModelId: string;
  selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
  session: Session;
}) {
  const router = useRouter();
  const { open, toggleSidebar } = useSidebar();

  const { width: windowWidth } = useWindowSize();

  return (
    <header className="flex sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            data-testid="sidebar-toggle-button"
            onClick={toggleSidebar}
            variant="outline"
            className="md:px-2 md:h-fit"
          >
            <SidebarLeftIcon size={16} />
          </Button>
        </TooltipTrigger>
        <TooltipContent align="start">Toggle Sidebar</TooltipContent>
      </Tooltip>

      {(!open || windowWidth < 768) && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="order-2 md:order-1 md:px-2 px-2 md:h-fit ml-auto md:ml-0"
              onClick={() => {
                router.push("/");
                router.refresh();
              }}
            >
              <PlusIcon />
              <span className="md:sr-only">New Chat</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>New Chat</TooltipContent>
        </Tooltip>
      )}

      {!isReadonly && (
        <ModelSelector
          session={session}
          selectedModelId={selectedModelId}
          className="order-1 md:order-2"
        />
      )}

      {!isReadonly && (
        <VisibilitySelector
          chatId={chatId}
          selectedVisibilityType={selectedVisibilityType}
          className="order-1 md:order-3"
        />
      )}
    </header>
  );
}

export const ChatHeader = memo(PureChatHeader, (prevProps, nextProps) => {
  return prevProps.selectedModelId === nextProps.selectedModelId;
});
