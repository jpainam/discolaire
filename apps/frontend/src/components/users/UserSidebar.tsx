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
  BellRing,
  Computer,
  KeySquare,
  LockKeyhole,
  Settings,
  User,
} from "lucide-react";

import { useParams, usePathname } from "next/navigation";
import { useLocale } from "~/i18n";
import { SidebarLogo } from "../sidebar-logo";
import Link from "next/link";
export function UserSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const params = useParams<{ id: string }>();
  const data = {
    information: [
      {
        name: "profile",
        icon: User,
        url: `/users/${params.id}`,
      },
      {
        name: "password",
        icon: LockKeyhole,
        url: `/users/${params.id}/password`,
      },
      {
        name: "roles",
        icon: KeySquare,
        url: `/users/${params.id}/roles`,
      },
      {
        name: "notifications",
        icon: BellRing,
        url: `/users/${params.id}/notifications`,
      },

      {
        name: "settings",
        icon: Settings,
        url: `/users/${params.id}/settings`,
      },
      {
        name: "logs_and_activities",
        icon: Computer,
        url: `/users/${params.id}/logs`,
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
                <Link href={"/"}>
                  <ArrowLeft />
                  <span>{t("back_to_home")}</span>
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
