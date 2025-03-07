"use client";

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
import {
  ArrowLeft,
  BookOpenCheck,
  CalendarDays,
  Folders,
  HistoryIcon,
  User,
} from "lucide-react";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
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
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="h-16 max-md:mt-2 mb-2 justify-center">
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent className="-mt-2">
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

        <SidebarGroup className="pt-0">
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
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
