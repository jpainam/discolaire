"use client";

import {
  Atom,
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
  SchoolIcon,
  Send,
  Settings,
  Settings2,
  Star,
  Users,
} from "lucide-react";

import { useLocale } from "@repo/i18n";

import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
} from "./sidebar";
import { StorageCard } from "./storage-card";
import { TeamSwitcher } from "./team-switcher";

export function AppSidebar() {
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
            title: t("students"),
            url: "/administration/students",
            icon: Users,
            description: "View your recent prompts",
          },
          {
            title: t("classrooms"),
            url: "/administration/classrooms",
            icon: Star,
            description: "Browse your starred prompts",
          },
          {
            title: t("staffs"),
            url: "/administration/staffs",
            icon: Settings2,
            description: "Configure your playground",
          },
          {
            title: t("contacts"),
            url: "/administration/contacts",
            icon: Settings2,
            description: "Configure your playground",
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
            icon: ReceiptIcon,
            description: "Our fastest model for general use cases.",
          },
          {
            title: "Transactions",
            url: "/administration/accounting/transactions",
            icon: HandCoinsIcon,
            description: "Performance and speed for efficiency.",
          },
          {
            title: "Groupes",
            url: "/administration/accounting/groups",
            icon: BoxesIcon,
            description: "The most powerful model for complex computations.",
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
    searchResults: [
      {
        title: "Routing Fundamentals",
        teaser:
          "The skeleton of every application is routing. This page will introduce you to the fundamental concepts of routing for the web and how to handle routing in Next.js.",
        url: "#",
      },
      {
        title: "Layouts and Templates",
        teaser:
          "The special files layout.js and template.js allow you to create UI that is shared between routes. This page will guide you through how and when to use these special files.",
        url: "#",
      },
      {
        title: "Data Fetching, Caching, and Revalidating",
        teaser:
          "Data fetching is a core part of any application. This page goes through how you can fetch, cache, and revalidate data in React and Next.js.",
        url: "#",
      },
      {
        title: "Server and Client Composition Patterns",
        teaser:
          "When building React applications, you will need to consider what parts of your application should be rendered on the server or the client. ",
        url: "#",
      },
      {
        title: "Server Actions and Mutations",
        teaser:
          "Server Actions are asynchronous functions that are executed on the server. They can be used in Server and Client Components to handle form submissions and data mutations in Next.js applications.",
        url: "#",
      },
    ],
  };
  return (
    <Sidebar>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarItem>
          <SidebarLabel>{t("establishment")}</SidebarLabel>
          <NavMain items={data.navMain} searchResults={data.searchResults} />
        </SidebarItem>
        <SidebarItem>
          <SidebarLabel>Projects</SidebarLabel>
          <NavProjects projects={data.projects} />
        </SidebarItem>
        <SidebarItem className="mt-auto">
          <SidebarLabel>Help</SidebarLabel>
          <NavSecondary items={data.navSecondary} />
        </SidebarItem>
        <SidebarItem>
          <StorageCard />
        </SidebarItem>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
