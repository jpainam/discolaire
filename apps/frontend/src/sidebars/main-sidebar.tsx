"use client";

import {
  RiAdminLine,
  RiLeafLine,
  RiScanLine,
  RiSettings3Line,
  RiUserFollowLine,
} from "@remixicon/react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@repo/ui/components/sidebar";
import { FolderOpen, HouseIcon, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "~/i18n";
export function MainSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const data = [
    {
      name: "dashboard",
      url: `/`,
      icon: RiScanLine,
    },
    {
      name: "students",
      url: `/students`,
      icon: Users,
    },

    {
      name: "classrooms",
      url: `/classrooms`,
      icon: HouseIcon,
    },
    {
      name: "contacts",
      url: `/contacts`,
      icon: RiUserFollowLine,
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

  const others = [
    {
      name: "settings",
      url: `/settings`,
      icon: RiSettings3Line,
    },
    {
      name: "help_center",
      url: `/help_center`,
      icon: RiLeafLine,
    },
  ];

  const { t } = useLocale();
  const pathname = usePathname();
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
          <SidebarGroupLabel className="uppercase text-muted-foreground/60">
            {t("information")}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    className="group/menu-button font-medium gap-2 h-9 rounded-md bg-gradient-to-r hover:bg-transparent hover:from-sidebar-accent hover:to-sidebar-accent/40 data-[active=true]:from-primary/20 data-[active=true]:to-primary/5 "
                    asChild
                    tooltip={t(item.name)}
                    isActive={pathname === item.url}
                  >
                    <Link href={item.url}>
                      <item.icon
                        className="text-muted-foreground/60 group-data-[active=true]/menu-button:text-primary"
                        size={22}
                        aria-hidden="true"
                      />
                      <span>{t(item.name)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase text-muted-foreground/60">
            {t("others")}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {others.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    className="group/menu-button font-medium gap-3 h-9 rounded-md bg-gradient-to-r hover:bg-transparent hover:from-sidebar-accent hover:to-sidebar-accent/40 data-[active=true]:from-primary/20 data-[active=true]:to-primary/5"
                    asChild
                    tooltip={t(item.name)}
                    isActive={pathname === item.url}
                  >
                    <Link href={item.url}>
                      <item.icon
                        className="text-muted-foreground/60 group-data-[active=true]/menu-button:text-primary"
                        size={22}
                        aria-hidden="true"
                      />
                      <span>{t(item.name)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
