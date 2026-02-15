"use client";

import type React from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { authClient } from "~/auth/client";
import { FeedBackDialog } from "~/components/FeedbackDialog";
import { SidebarLogo } from "~/components/sidebar-logo";
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "~/components/ui/sidebar";
import { UserNav } from "~/components/user-nav";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import {
  AdministrationIcon,
  AiIcon,
  ContactIcon,
  DashboardIcon,
  GroupsIcon,
  HomeIcon,
  InformationIcon,
  LibraryIcon,
  SettingsIcon,
  UsersIcon,
} from "~/icons";
import { Shortcut } from "./shortcuts/Shortcut";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

interface MenuItem {
  name: string;
  url: string;
  icon: ReactNode;
  items?: { name: string; url: string }[];
}
export function MainSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const home: MenuItem[] = [
    {
      name: "dashboard",
      url: `/`,
      icon: <DashboardIcon />,
      items: [],
    },
  ];
  const data: MenuItem[] = [
    {
      name: "students",
      url: `/students`,
      icon: <UsersIcon />,
    },

    {
      name: "classrooms",
      url: `/classrooms`,
      icon: <HomeIcon />,
    },
  ];
  const tools: MenuItem[] = [
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
      icon: <GroupsIcon />,
      items: [
        { name: "list", url: "/staffs" },
        { name: "Attendance", url: "/staffs/attendances" },
        { name: "add", url: "/staffs/create" },
      ],
    });
  }
  data.push({
    name: "parents",
    url: `/contacts`,
    icon: <ContactIcon />,
  });
  const canReadLibrary = useCheckPermission("menu:library.read");
  if (canReadLibrary) {
    tools.push({
      name: "library",
      url: `/library`,
      icon: <LibraryIcon />,
    });
  }
  const canReadAdministration = useCheckPermission("menu:administration.read");
  if (canReadAdministration) {
    data.push({
      name: "administration",
      url: `/administration`,
      icon: <AdministrationIcon />,
    });
  }

  tools.push({
    name: "ai",
    url: `/ai`,
    icon: <AiIcon />,
  });

  const others: MenuItem[] = [
    {
      name: "settings",
      url: `/users/${session?.user.id}/settings`,
      icon: <SettingsIcon />,
    },
    {
      name: "help_center",
      url: `https://docs.discolaire.com`,
      icon: <InformationIcon />,
    },
  ];

  const menus = { home, data, others, tools };

  const t = useTranslations();

  const { openModal } = useModal();
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>

      <SidebarContent>
        <MenuSideGroup items={menus.home} label={"home"} />
        <MenuSideGroup items={menus.data} label={"Data"} />
        {/* <SidebarSeparator className="mx-0 px-2" /> */}
        <MenuSideGroup items={menus.tools} label={"tools"} />
        {/* <SidebarSeparator className="mx-0 w-[95%]" /> */}
        <MenuSideGroup items={menus.others} label={"others"} />

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button
                    onClick={() => {
                      openModal({
                        className: "sm:max-w-xl",
                        title: t("feedback"),
                        view: <FeedBackDialog />,
                      });
                    }}
                  >
                    <InformationIcon />
                    <span>Feedback</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Shortcut />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserNav />
      </SidebarFooter>
      {/* <SidebarRail /> */}
    </Sidebar>
  );
}

function MenuSideGroup({ items, label }: { items: MenuItem[]; label: string }) {
  const t = useTranslations();
  const pathname = usePathname();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t(label)}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((menu) => {
          if (menu.items?.length) {
            return (
              <Collapsible
                key={menu.name}
                asChild
                defaultOpen={pathname === menu.url}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={t(menu.name)}>
                      {menu.icon}
                      <span>{t(menu.name)}</span>
                      <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {menu.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.name}>
                          <SidebarMenuSubButton asChild>
                            <Link href={subItem.url}>
                              <span>{t(subItem.name)}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          }
          return (
            <SidebarMenuItem key={menu.name}>
              <SidebarMenuButton
                asChild
                tooltip={t(menu.name)}
                isActive={pathname === menu.url}
              >
                <Link href={menu.url}>
                  {menu.icon}
                  <span>{t(menu.name)}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
