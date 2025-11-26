"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  ArrowLeft,
  BookOpenCheck,
  CalendarDays,
  Folders,
  HistoryIcon,
  KeySquare,
  User,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@repo/ui/components/sidebar";

import { useLocale } from "~/i18n";
import { SidebarLogo } from "../sidebar-logo";

export function StaffSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const params = useParams<{ id: string }>();
  const data = {
    information: [
      {
        name: "profile",
        icon: User,
        url: `/staffs/${params.id}`,
      },
      {
        name: "permissions",
        icon: KeySquare,
        url: `/staffs/${params.id}/permissions`,
      },

      {
        name: "activities",
        icon: HistoryIcon,
        url: `/staffs/${params.id}/activities`,
      },
      {
        name: "teachings",
        icon: BookOpenCheck,
        url: `/staffs/${params.id}/teachings`,
      },
      {
        name: "timetables",
        icon: CalendarDays,
        url: `/staffs/${params.id}/timetables`,
      },
      {
        icon: Folders,
        name: "documents",
        url: `/staffs/${params.id}/documents`,
      },
    ],
  };
  const { t } = useLocale();
  const pathname = usePathname();
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={t("back_to_home")}>
                <Link href={"/staffs"}>
                  <ArrowLeft />
                  <span>{t("back")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          {/* <SidebarGroupLabel>{t("information")}</SidebarGroupLabel> */}
          <SidebarMenu>
            {data.information.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  asChild
                  tooltip={t(item.name)}
                  isActive={pathname === item.url}
                >
                  <Link href={item.url}>
                    <item.icon
                    //className="text-muted-foreground/60 group-data-[active=true]/menu-button:text-primary"
                    //size={22}
                    //aria-hidden="true"
                    />
                    <span>{t(item.name)}</span>
                  </Link>
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
