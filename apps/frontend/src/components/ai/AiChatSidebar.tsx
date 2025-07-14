"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/ui/components/sidebar";
import { Plus } from "lucide-react";
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
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Plus />
              <span>New Chat</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarHistory />
      </SidebarContent>
      {/* <SidebarFooter>{<SidebarUserNav  />}</SidebarFooter> */}
    </Sidebar>
  );
}
