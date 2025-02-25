"use client";

import { RiAdminLine } from "@remixicon/react";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/ui/components/sidebar";
import { FolderOpen, House, HouseWifiIcon, Users } from "lucide-react";
import { useLocale } from "~/i18n";

export function MainSidebar() {
  const data = [
    {
      name: "home",
      url: `/`,
      icon: House,
    },
    {
      name: "students",
      url: `/students`,
      icon: Users,
    },

    {
      name: "classrooms",
      url: `/classrooms`,
      icon: HouseWifiIcon,
    },
    {
      name: "contacts",
      url: `/contacts`,
      icon: Users,
    },
    {
      name: "staffs",
      url: `/staffs`,
      icon: FolderOpen,
    },

    {
      name: "administration",
      url: `/administration`,
      icon: RiAdminLine,
    },
  ];

  const { t } = useLocale();
  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel className="uppercase">
          {t("information")}
        </SidebarGroupLabel>
        <SidebarMenu>
          {data.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild tooltip={t(item.name)}>
                <a href={item.url}>
                  <item.icon />
                  <span>{t(item.name)}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
      {/* <SidebarGroup>
        <SidebarGroupLabel>{t("academics")}</SidebarGroupLabel>
        <SidebarMenu>
          {data.academics.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild tooltip={t(item.name)}>
                <Link href={item.url}>
                  <item.icon />
                  <span>{t(item.name)}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
      */}
    </SidebarContent>
  );
}
