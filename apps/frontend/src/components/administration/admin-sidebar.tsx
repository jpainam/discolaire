"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BlindsIcon,
  BrickWall,
  CalendarDays,
  CircleArrowOutUpRight,
  CircleDollarSign,
  Frame,
  ImageUp,
  LayoutListIcon,
  LifeBuoy,
  PrinterIcon,
  SchoolIcon,
  ScrollTextIcon,
  Send,
  Settings,
  Users,
} from "lucide-react";

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

import { useLocale } from "~/i18n";
import { SearchForm } from "../search-form";
import { SidebarLogo } from "../sidebar-logo";
import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
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
            title: "classrooms",
            url: "/administration/classrooms",
          },
          {
            title: "students",
            url: "/administration/students",
          },
          {
            title: "grades_and_reports",
            url: "/administration/grade-reports",
          },
          // {
          //   title: "directory",
          //   url: "/administration/directory",
          // },
        ],
      },
      {
        title: "Finances",
        url: "#",
        icon: CircleDollarSign,
        //isActive: true,
        items: [
          {
            title: "school_fees",
            url: "/administration/accounting/fees",
          },
          {
            title: "Accounting Journals",
            url: "/administration/accounting/journal",
          },
          {
            title: "Transactions",
            url: "/administration/accounting/transactions",
          },
          {
            title: "Sasie des operations",
            url: "/administration/accounting/create",
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
            url: "/administration/users/permissions",
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
            title: "Api Keys",
            url: "/administration/settings/api-keys",
          },
          // {
          //   title: "religions",
          //   url: "/administration/settings/religions",
          // },
          // {
          //   title: "sports",
          //   url: "/administration/settings/sports",
          // },
          // {
          //   title: "clubs",
          //   url: "/administration/settings/clubs",
          // },
          {
            title: "former_schools",
            url: "/administration/settings/former-schools",
          },
          // {
          //   title: "staff_level",
          //   url: "/administration/settings/staff-levels",
          // },
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
    ],
  };
  const others = [
    {
      name: "academy",
      url: "/administration/academy",
      icon: ScrollTextIcon,
    },
    {
      name: "inventory",
      url: "/administration/inventory",
      icon: LayoutListIcon,
    },
    {
      name: "reports",
      url: "/administration/reports",
      icon: PrinterIcon,
    },
    {
      name: "schoolYear",
      url: "/administration/school-years",
      icon: CalendarDays,
    },
    {
      name: "school_life",
      url: "/administration/attendances",
      icon: BrickWall,
      //icon: CalendarArrowUp,
    },
    {
      name: "photos",
      url: "/administration/photos",
      icon: ImageUp,
    },
    {
      name: "subscriptions",
      url: "/administration/subscriptions",
      icon: CircleArrowOutUpRight,
    },
    {
      name: "audit_logs",
      url: "/administration/audit-logs",
      icon: BlindsIcon,
    },
  ];
  const pathname = usePathname();
  const { t } = useLocale();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarLogo />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={adminMenu.navMain} />
        <SidebarGroup>
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
                      //className="text-muted-foreground/60 group-data-[active=true]/menu-button:text-primary"
                      //size={22}
                      aria-hidden="true"
                    />
                    <span>{t(item.name)}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
