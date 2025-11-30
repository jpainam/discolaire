"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  ActivityIcon,
  ArrowLeft,
  BellRing,
  CircleDollarSign,
  Computer,
  KeySquareIcon,
  Settings,
  User,
} from "lucide-react";
import { useTranslations } from "next-intl";

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

import { authClient } from "~/auth/client";
import { useCheckPermission } from "~/hooks/use-permission";
import { PermissionAction } from "~/permissions";
import { SidebarLogo } from "../sidebar-logo";

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
        name: "mail",
        icon: User,
        url: `/users/${params.id}/mails`,
      },
      {
        name: "subscriptions",
        icon: CircleDollarSign,
        url: `/users/${params.id}/subscriptions`,
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
        name: "activities",
        icon: ActivityIcon,
        url: `/users/${params.id}/activities`,
      },
      {
        name: "logs_and_activities",
        icon: Computer,
        url: `/users/${params.id}/logs`,
      },
    ],
  };

  const t = useTranslations();
  const { data: session } = authClient.useSession();
  const canReadPermission = useCheckPermission("policy", PermissionAction.READ);
  if (canReadPermission && session?.user.profile === "staff") {
    data.information.push({
      name: "permissions",
      icon: KeySquareIcon,
      url: `/users/${params.id}/permissions`,
    });
  }
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
