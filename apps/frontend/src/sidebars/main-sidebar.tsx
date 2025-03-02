"use client";

import { RiAdminLine } from "@remixicon/react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@repo/ui/components/sidebar";
import { FolderOpen, House, HouseWifiIcon, Users } from "lucide-react";
import Image from "next/image";
import { useLocale } from "~/i18n";
export function MainSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
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
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center px-2  pt-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg ">
            {/* <GalleryVerticalEnd className="h-4 w-4" /> */}
            <Image
              alt="logo"
              src={"/images/logo.png"}
              width={100}
              height={100}
            />
          </div>

          <div className="ml-2 text-lg font-semibold group-data-[collapsible=icon]:hidden">
            Discolaire
          </div>
        </div>
      </SidebarHeader>
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
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
