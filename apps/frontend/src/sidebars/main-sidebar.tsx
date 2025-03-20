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
import {
  CalendarDays,
  FolderOpen,
  HouseIcon,
  LibraryBigIcon,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarLogo } from "~/components/sidebar-logo";
import { useCheckPermission } from "~/hooks/use-permission";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";
import { useSession } from "~/providers/AuthProvider";
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
  ];
  const session = useSession();
  if (session.user?.profile == "staff") {
    data.push(
      ...[
        {
          name: "staffs",
          url: `/staffs`,
          icon: FolderOpen,
        },
        {
          name: "timetables",
          url: `/timetables`,
          icon: CalendarDays,
        },
      ]
    );
  }
  data.push({
    name: "contacts",
    url: `/contacts`,
    icon: RiUserFollowLine,
  });
  const canReadLibrary = useCheckPermission(
    "menu:library",
    PermissionAction.READ
  );
  if (canReadLibrary) {
    data.push({
      name: "library",
      url: `/library`,
      icon: LibraryBigIcon,
    });
  }
  const canReadAdministration = useCheckPermission(
    "menu:administration",
    PermissionAction.READ
  );
  if (canReadAdministration) {
    data.push({
      name: "administration",
      url: `/administration`,
      icon: RiAdminLine,
    });
  }

  const others = [
    {
      name: "settings",
      url: `/users/${session.user?.id}/settings`,
      icon: RiSettings3Line,
    },
    {
      name: "help_center",
      url: `https://docs.discolaire.com`,
      icon: RiLeafLine,
    },
  ];

  const { t } = useLocale();
  const pathname = usePathname();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel>{t("information")}</SidebarGroupLabel> */}
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {data.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    //className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:hover:bg-primary/90 data-[active=true]:hover:text-primary-foreground data-[active=true]:duration-200 data-[active=true]:ease-linear"
                    //className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
                    asChild
                    tooltip={t(item.name)}
                    isActive={pathname == item.url}
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
          <SidebarGroupLabel>{t("others")}</SidebarGroupLabel>
          {/* <SidebarGroupContent> */}
          <SidebarMenu>
            {others.map((item) => (
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
          {/* </SidebarGroupContent> */}
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
