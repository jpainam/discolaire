"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/ui/components/sidebar";
import { Plus } from "lucide-react";
import Link from "next/link";
import { SidebarHistory } from "~/components/ai/sidebar-history";
import { SidebarLogo } from "../sidebar-logo";

export function AiChatSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  //const router = useRouter();
  //const { setOpenMobile } = useSidebar();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>

      <SidebarContent>
        {/* <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={t("back")}>
                <Link href={"/"}>
                  <ArrowLeft />
                  <span>{t("back")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup> */}
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/ai">
                  <Plus />
                  <span>New Chat</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarHistory />
      </SidebarContent>
      {/* <SidebarFooter>{<SidebarUserNav  />}</SidebarFooter> */}
    </Sidebar>
  );
}
