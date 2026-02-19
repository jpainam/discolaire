"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { ArrowLeft, Shield } from "lucide-react";
import { useTranslations } from "next-intl";

import { useSession } from "~/auth/client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { useCheckPermission } from "~/hooks/use-permission";
import {
  CalendarDays,
  ChatIcon,
  GradeIcon,
  MoneyIcon,
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
  const { data: session } = useSession();
  const canUpdatePermission = useCheckPermission("permission.update");
  const isStaff = session?.user.profile === "staff";

  const information = [
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
      name: "transactions",
      url: `/contacts/${params.id}/transactions`,
      icon: <MoneyIcon />,
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
  ];

  if (isStaff && canUpdatePermission) {
    information.push({
      name: "permissions",
      icon: <Shield className="size-4" />,
      url: `/contacts/${params.id}/permissions`,
    });
  }

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
            {information.map((item) => (
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
