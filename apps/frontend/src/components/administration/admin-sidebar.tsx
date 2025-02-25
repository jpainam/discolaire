"use client";

import { Frame, LifeBuoy, Map, PieChart, Send } from "lucide-react";

import { SidebarContent } from "@repo/ui/components/sidebar";
import {
  CalendarDays,
  CircleDollarSign,
  SchoolIcon,
  Settings,
  Users,
} from "lucide-react";
import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";

export function AdminSidebar() {
  const adminMenu = {
    navMain: [
      {
        title: "my_school",
        url: "/administration/my-school",
        icon: SchoolIcon,

        items: [
          {
            title: "my_school",
            url: "/administration/my-school",
          },
          {
            title: "courses",
            url: "/administration/courses",
          },
          {
            title: "classroom_settings",
            url: "/administration/classrooms",
          },
          {
            title: "directory",
            url: "/administration/directory",
          },
        ],
      },
      {
        title: "Finances",
        url: "#",
        icon: CircleDollarSign,
        //isActive: true,
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
            title: "settings",
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
        title: "schoolYear",
        url: "/administration/school-years",
        icon: CalendarDays,
        items: [
          {
            title: "schoolYear",
            url: "/administration/school-years",
          },
          {
            title: "periods",
            url: "/administration/school-years/terms",
          },
        ],
      },
      {
        title: "settings",
        url: "/administration/settings",
        icon: Settings,
        items: [
          {
            title: "configurations_page",
            url: "/administration/settings",
          },
          {
            title: "grade_options",
            url: "/administration/settings/grade-options",
          },
          {
            title: "religions",
            url: "/administration/settings/religions",
          },
          {
            title: "sports",
            url: "/administration/settings/sports",
          },
          {
            title: "clubs",
            url: "/administration/settings/clubs",
          },
          {
            title: "former_schools",
            url: "/administration/settings/former-schools",
          },
          {
            title: "staff_level",
            url: "/administration/settings/staff-levels",
          },
        ],
      },
    ],
  };

  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },

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
        name: "sms_and_emails",
        url: "/administration/sms-emails",
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
    <SidebarContent>
      <NavMain items={adminMenu.navMain} />
      <NavProjects projects={data.projects} />
    </SidebarContent>
  );
}
