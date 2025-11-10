"use client";

import type { LucideIcon } from "lucide-react";
import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BrainIcon,
  BrickWall,
  CogIcon,
  ContactIcon,
  FolderOpen,
  HelpCircleIcon,
  HouseIcon,
  InfoIcon,
  LibraryBigIcon,
  Users,
  WrenchIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@repo/ui/components/sidebar";

import { authClient } from "~/auth/client";
import { FeedBackDialog } from "~/components/FeedbackDialog";
import { SidebarLogo } from "~/components/sidebar-logo";
import { UserNav } from "~/components/user-nav";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { PermissionAction } from "~/permissions";

export function MainSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const home = [
    {
      name: "dashboard",
      url: `/`,
      icon: BrickWall,
    },
  ];
  const data = [
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
  const tools = [
    // {
    //   name: "timetables",
    //   url: `/timetables`,
    //   icon: CalendarDays,
    // },
  ];
  const { data: session } = authClient.useSession();
  if (session?.user.profile == "staff") {
    data.push({
      name: "staffs",
      url: `/staffs`,
      icon: FolderOpen,
    });
  }
  data.push({
    name: "parents",
    url: `/contacts`,
    icon: ContactIcon,
  });
  const canReadLibrary = useCheckPermission(
    "menu:library",
    PermissionAction.READ,
  );
  if (canReadLibrary) {
    tools.push({
      name: "library",
      url: `/library`,
      icon: LibraryBigIcon,
    });
  }
  const canReadAdministration = useCheckPermission(
    "menu:administration",
    PermissionAction.READ,
  );
  if (canReadAdministration) {
    data.push({
      name: "administration",
      url: `/administration`,
      icon: WrenchIcon,
    });
  }

  tools.push({
    name: "ai",
    url: `/ai`,
    icon: BrainIcon,
  });

  const others = [
    {
      name: "settings",
      url: `/users/${session?.user.id}/settings`,
      icon: CogIcon,
    },
    {
      name: "help_center",
      url: `https://docs.discolaire.com`,
      icon: InfoIcon,
    },
  ];

  const menus = { home, data, others, tools };

  const t = useTranslations();

  const { openModal } = useModal();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent>
        <MenuSideGroup items={menus.home} label={"home"} />
        <MenuSideGroup items={menus.data} label={"Data"} />
        <MenuSideGroup items={menus.tools} label={"tools"} />
        <MenuSideGroup items={menus.others} label={"others"} />

        <SidebarGroup className="mt-auto md:hidden">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button
                    onClick={() => {
                      openModal({
                        title: t("feedback"),
                        view: <FeedBackDialog />,
                      });
                    }}
                  >
                    <HelpCircleIcon />
                    <span>Feedback</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  {/* <Shortcut /> */}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserNav className="md:hidden" />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function MenuSideGroup({
  items,
  label,
}: {
  items: { name: string; url: string; icon: LucideIcon }[];
  label: string;
}) {
  const t = useTranslations();
  const pathname = usePathname();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t(label)}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              asChild
              tooltip={t(item.name)}
              isActive={pathname === item.url}
            >
              <Link href={item.url}>
                <item.icon />
                <span>{t(item.name)}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
