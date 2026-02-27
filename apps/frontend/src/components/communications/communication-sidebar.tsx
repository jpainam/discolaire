"use client";

import type * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Inbox, PenSquare, Send, Trash2 } from "lucide-react";

import type { RecipientTarget } from "./recipient-selector";
import { Button } from "~/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { useModal } from "~/hooks/use-modal";
import { SidebarLogo } from "../sidebar-logo";
import RecipientSelector from "./recipient-selector";

type ComposeSta =
  | { stage: "idle" }
  | { stage: "selecting-recipients" }
  | { stage: "composing"; target: RecipientTarget }
  | { stage: "editing-recipients"; target: RecipientTarget };

const NAV_ITEMS = [
  { id: "inbox", label: "Inbox", icon: Inbox, url: "/communications" },
  { id: "sent", label: "Sent", icon: Send, url: "/communications/sent" },
  {
    id: "drafts",
    label: "Drafts",
    icon: FileText,
    url: "/communications/drafts",
  },
  { id: "trash", label: "Trash", icon: Trash2, url: "/communications/trash" },
];
export function CommunicationSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { openModal } = useModal();
  const [composeState, setComposeState] = useState<ComposeSta>({
    stage: "idle",
  });

  function handleRecipientConfirm(target: RecipientTarget) {
    if (composeState.stage === "editing-recipients") {
      setComposeState({ stage: "composing", target });
    } else {
      setComposeState({ stage: "composing", target });
    }
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Button
                  onClick={() => {
                    openModal({
                      className: "sm:max-w-3xl",
                      view: (
                        <RecipientSelector
                          initialTarget={null}
                          onConfirm={handleRecipientConfirm}
                        />
                      ),
                    });
                  }}
                >
                  <PenSquare className="h-4 w-4" />
                  Compose Message
                </Button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>MAILBOX</SidebarGroupLabel>
          <SidebarMenu>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.label}
                    isActive={pathname === item.url}
                  >
                    <Link href={item.url}>
                      <Icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>QUICK LINKS</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip={""}
                //isActive={pathname === item.label}
              >
                <Link href={"#"}></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
