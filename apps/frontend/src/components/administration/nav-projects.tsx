"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  FileClockIcon,
  GalleryHorizontalEnd,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/ui/sidebar";
import { MailIcon } from "~/icons";

export function NavProjects({
  projects,
}: {
  projects: {
    name: string;
    url: string;
    icon: ReactNode;
  }[];
}) {
  const { isMobile } = useSidebar();

  const t = useTranslations();
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{t("communications")}</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link href={"/administration/communications/emails"}>
              <MailIcon />
              <span>Emails</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <Link href={item.url}>
                {item.icon}
                <span>{t(item.name)}</span>
              </Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <GalleryHorizontalEnd className="text-muted-foreground" />
                  <span>{t("templates")}</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileClockIcon className="text-muted-foreground" />
                  <span>{t("history")}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
