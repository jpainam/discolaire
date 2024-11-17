"use client";

import {
  Atom,
  CalendarDays,
  CircleDollarSign,
  Eclipse,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Rabbit,
  SchoolIcon,
  Send,
  Settings,
  Users,
} from "lucide-react";

import { useLocale } from "@repo/i18n";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@repo/ui/sidebar";

import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useLocale();
  const data = {
    teams: [
      {
        name: "Acme Inc",
        logo: Atom,
        plan: "Enterprise",
      },
      {
        name: "Acme Corp.",
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
        url: "/administration/my-school",
        icon: SchoolIcon,
        isActive: true,
        items: [
          {
            title: t("courses"),
            url: "/administration/courses",
          },
          {
            title: t("classroom_settings"),
            url: "/administration/classrooms",
          },
          {
            title: t("directory"),
            url: "/administration/directory",
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
            url: "/administration/accounting/fees",
          },
          {
            title: "Transactions",
            url: "/administration/accounting/transactions",
          },
          {
            title: "Groupes",
            url: "/administration/accounting/groups",
          },
          {
            title: t("settings"),
            url: "/administration/accounting/settings",
          },
        ],
      },
      {
        title: "Utilisateurs",
        url: "/administration/users",
        icon: Users,
        items: [
          {
            title: "Liste",
            url: "/administration/users",
          },
          {
            title: "Roles",
            url: "/administration/users/roles",
          },
          {
            title: "Permissions",
            url: "/administration/users/policies",
          },
        ],
      },
      {
        title: t("schoolYear"),
        url: "/administration/school-years",
        icon: CalendarDays,
        items: [
          {
            title: t("schoolYear"),
            url: "/administration/school-years",
          },
          {
            title: t("periods"),
            url: "/administration/school-years/terms",
          },
        ],
      },
      {
        title: t("settings"),
        url: "/administration/settings",
        icon: Settings,
        items: [
          {
            title: t("grade_options"),
            url: "/administration/settings/grade-options",
          },
          {
            title: t("religions"),
            url: "/administration/settings/religions",
          },
          {
            title: t("sports"),
            url: "/administration/settings/sports",
          },
          {
            title: t("clubs"),
            url: "/administration/settings/clubs",
          },
          {
            title: t("former_schools"),
            url: "/administration/settings/former-schools",
          },
          {
            title: t("staff_level"),
            url: "/administration/settings/staff-levels",
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
      {/* <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader> */}
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
