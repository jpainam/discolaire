"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import {
  CalendarDays,
  ChatIcon,
  GradeIcon,
  NotificationIcon,
  ReportGradeIcon,
  UserIcon,
  UsersIcon,
} from "~/icons";
import { SidebarLogo } from "../sidebar-logo";

export function ContactSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const params = useParams<{ id: string }>();
  const data = {
    information: [
      {
        name: "profile",
        icon: <UserIcon />,
        url: `/contacts/${params.id}`,
      },

      {
        name: "students",
        icon: <UsersIcon />,
        url: `/contacts/${params.id}/students`,
      },
      {
        name: "grades",
        url: `/contacts/${params.id}/grades`,
        icon: <GradeIcon />,
      },
      {
        name: "timetable",
        url: `/contacts/${params.id}/timetables`,
        icon: <CalendarDays />,
      },
      {
        name: "documents",
        url: `/contacts/${params.id}/documents`,
        icon: <ReportGradeIcon />,
      },
      {
        name: "communications",
        url: `/contacts/${params.id}/communications`,
        icon: <ChatIcon />,
      },
      {
        name: "notifications",
        icon: <NotificationIcon />,
        url: `/contacts/${params.id}/notifications`,
      },
    ],
  };

  const t = useTranslations();
  const pathname = usePathname();
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={t("back_to_home")}>
                <Link href={"/contacts"}>
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
                    {item.icon}
                    <span>{t(item.name)}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
