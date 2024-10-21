"use client";

import * as React from "react";
import {
  Atom,
  BookUserIcon,
  BoxesIcon,
  CalendarDays,
  CircleDollarSign,
  Eclipse,
  Frame,
  HandCoinsIcon,
  LifeBuoy,
  Map,
  PieChart,
  Rabbit,
  ReceiptIcon,
  School,
  SchoolIcon,
  Send,
  Settings,
  Users,
} from "lucide-react";

import { useLocale } from "@repo/hooks/use-locale";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@repo/ui/sidebar";

import { routes } from "~/configs/routes";
import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useLocale();
  const data = {
    teams: [
      {
        name: t("dashboard"),
        logo: Atom,
        plan: "Enterprise",
      },
      {
        name: t("datum"),
        logo: Eclipse,
        plan: "Startup",
      },
      {
        name: "Evil Corp.",
        logo: Rabbit,
        plan: "Free",
      },
    ],
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: t("my_school"),
        url: routes.administration.my_school.index,
        icon: SchoolIcon,
        isActive: true,
        items: [
          {
            title: t("courses"),
            url: routes.administration.courses.index,
            icon: Users,
            description: "All your courses",
          },
          {
            title: t("classroom_settings"),
            url: routes.administration.classrooms.index,
            icon: School,
            description: "Classroom settings",
          },
          {
            title: t("directory"),
            url: routes.administration.directory.index,
            icon: BookUserIcon,
            description: "All your directory",
          },
        ],
      },
      {
        title: "Finances",
        url: "#",
        icon: CircleDollarSign,
        items: [
          {
            title: "Frais",
            url: "/admin/accounting/fees",
            icon: ReceiptIcon,
            description: "Our fastest model for general use cases.",
          },
          {
            title: "Transactions",
            url: "/admin/accounting/transactions",
            icon: HandCoinsIcon,
            description: "Performance and speed for efficiency.",
          },
          {
            title: "Groupes",
            url: "/admin/accounting/groups",
            icon: BoxesIcon,
            description: "The most powerful model for complex computations.",
          },
        ],
      },
      {
        title: "Utilisateurs",
        url: "/admin/users",
        icon: Users,
        items: [
          {
            title: "Liste",
            url: "/admin/users",
          },
          {
            title: "Roles",
            url: "/admin/users/roles",
          },
          {
            title: "Permissions",
            url: "/admin/users/policies",
          },
        ],
      },
      {
        title: t("schoolYear"),
        url: "/admin/school-years",
        icon: CalendarDays,
        items: [
          {
            title: t("schoolYear"),
            url: "/admin/school-years",
          },
          {
            title: t("periods"),
            url: "/admin/school-years/terms",
          },
        ],
      },
      {
        title: t("settings"),
        url: "/admin/settings",
        icon: Settings,
        items: [
          {
            title: t("religions"),
            url: "/admin/settings/religions",
          },
          {
            title: t("sports"),
            url: "/admin/settings/sports",
          },
          {
            title: t("clubs"),
            url: "/admin/settings/clubs",
          },
          {
            title: t("former_schools"),
            url: "/admin/settings/former-schools",
          },
          {
            title: t("staff_level"),
            url: "/admin/settings/staff-levels",
          },
        ],
      },
    ],

    navSecondary: [
      {
        title: "Support",
        url: "#",
        icon: LifeBuoy,
      },
      {
        title: "Feedback",
        url: "#",
        icon: Send,
      },
    ],
    projects: [
      {
        name: "Design Engineering",
        url: "#",
        icon: Frame,
      },
      {
        name: "Sales & Marketing",
        url: "#",
        icon: PieChart,
      },
      {
        name: "Travel",
        url: "#",
        icon: Map,
      },
    ],
  };
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
