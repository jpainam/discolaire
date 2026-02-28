"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import {
  AttendanceIcon,
  BookmarkIcon,
  CalendarDays,
  FileIcon,
  FilesIcon,
  HelpIcon,
  HomeIcon,
  LibraryIcon,
  LockIcon,
  MailIcon,
  MoneyIcon,
  NotificationIcon,
  PrinterIcon,
  ReportGradeIcon,
  SettingsIcon,
  UsersIcon,
} from "~/icons";
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
        icon: <HomeIcon />,

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

          // {
          //   title: "directory",
          //   url: "/administration/directory",
          // },
        ],
      },
      {
        title: "Finances",
        url: "#",
        icon: <MoneyIcon />,
        //isActive: true,
        items: [
          {
            title: "school_fees",
            url: "/administration/accounting/fees",
          },

          {
            title: "Transactions",
            url: "/administration/accounting/transactions",
          },
          {
            title: "Compte Caisse",
            url: "/administration/accounting/funds",
          },
          {
            title: "Salary & Payroll",
            url: "/administration/accounting/salary",
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
        icon: <UsersIcon />,
        items: [
          {
            title: "Liste",
            url: "/administration/users",
          },
          {
            title: "create",
            url: "/administration/users/create",
          },
          {
            title: "Permissions",
            url: "/administration/users/permissions",
          },
          {
            title: "Roles",
            url: "/administration/users/roles",
          },
          {
            title: "Modules",
            url: "/administration/users/modules",
          },
        ],
      },

      {
        title: "settings",
        url: "/administration/settings",
        icon: <SettingsIcon />,
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
        icon: <HelpIcon />,
      },
      {
        title: "Feedback",
        url: "#",
        icon: <MailIcon />,
      },
    ],
    projects: [
      {
        name: "Notification templates",
        url: "/administration/notification-templates",
        icon: <NotificationIcon />,
      },
    ],
  };
  const others = [
    {
      name: "grades_and_reports",
      url: "/administration/grade-reports",
      icon: <ReportGradeIcon />,
    },
    {
      name: "academy",
      url: "/administration/academy",
      icon: <LibraryIcon />,
    },
    {
      name: "inventory",
      url: "/administration/inventory",
      icon: <FilesIcon />,
    },
    {
      name: "reports",
      url: "/administration/reports",
      icon: <PrinterIcon />,
    },
    {
      name: "schoolYear",
      url: "/administration/event-calendar",
      icon: <CalendarDays />,
    },
    {
      name: "school_life",
      url: "/administration/attendances",
      icon: <AttendanceIcon />,
    },
    {
      name: "photos",
      url: "/administration/photos",
      icon: <FileIcon />,
    },
    {
      name: "subscriptions",
      url: "/administration/subscriptions",
      icon: <BookmarkIcon />,
    },
    {
      name: "audit_logs",
      url: "/administration/audit-logs",
      icon: <LockIcon />,
    },
  ];
  const pathname = usePathname();

  const t = useTranslations();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarLogo />
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
                    {item.icon}
                    <span>{t(item.name)}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <NavProjects projects={data.projects} />
      </SidebarContent>
    </Sidebar>
  );
}
