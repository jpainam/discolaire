"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Shield } from "lucide-react";
import { useTranslations } from "next-intl";

import { useSession } from "~/auth/client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { useCheckPermission } from "~/hooks/use-permission";
import {
  AttendanceIcon,
  CalendarDays,
  ContactIcon,
  EnrollmentIcon,
  FilesIcon,
  FolderIcon,
  GradeIcon,
  HealthIcon,
  IDCardIcon,
  LibraryIcon,
  LockIcon,
  MailIcon,
  MoneyIcon,
  NotificationIcon,
  PrinterIcon,
  ReportGradeIcon,
  TextBookIcon,
} from "~/icons";
import { SidebarLogo } from "../sidebar-logo";

export function StudentSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const params = useParams<{ id: string }>();
  const { data: session } = useSession();
  const canUpdatePermission = useCheckPermission("permission.update");
  const isStaff = session?.user.profile === "staff";

  const informations = [
    {
      name: "profile",
      icon: <FilesIcon />,
      url: `/students/${params.id}`,
    },
    {
      name: "contacts",
      icon: <ContactIcon />,
      url: `/students/${params.id}/contacts`,
    },
    {
      name: "id_card",
      icon: <IDCardIcon />,
      url: `/students/${params.id}/id-card`,
    },
    {
      name: "login_info",
      icon: <LockIcon />,
      url: `/students/${params.id}/login-info`,
    },
  ];
  const academy = [
    {
      name: "enrollments",
      icon: <EnrollmentIcon />,
      url: `/students/${params.id}/enrollments`,
    },
    {
      name: "grades",
      icon: <GradeIcon />,
      url: `/students/${params.id}/grades`,
    },
    {
      name: "transcripts",
      icon: <LibraryIcon />,
      url: `/students/${params.id}/gradesheets`,
    },
    {
      name: "reportcards",
      icon: <ReportGradeIcon />,
      url: `/students/${params.id}/reportcards`,
    },
    {
      name: "assignments",
      icon: <TextBookIcon />,
      url: `/students/${params.id}/assignments`,
    },
  ];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const canReadTransaction = useCheckPermission("transaction.read");
  //if (!canReadTransaction) {
  informations.push({
    name: "transactions",
    icon: <MoneyIcon />,
    url: `/students/${params.id}/transactions`,
  });
  //}

  if (isStaff && canUpdatePermission) {
    informations.push({
      name: "permissions",
      icon: <Shield className="size-4" />,
      url: `/students/${params.id}/permissions`,
    });
  }

  const school_life = [
    {
      name: "attendances",
      icon: <AttendanceIcon />,
      url: `/students/${params.id}/attendances`,
    },
    {
      name: "timetable",
      icon: <CalendarDays />,
      url: `/students/${params.id}/timetables`,
    },
    {
      name: "mail",
      icon: <MailIcon />,
      url: `/students/${params.id}/mail`,
    },
    {
      name: "health",
      icon: <HealthIcon />,
      url: `/students/${params.id}/health`,
    },
    {
      name: "notifications",
      icon: <NotificationIcon />,
      url: `/students/${params.id}/notifications`,
    },
    {
      name: "documents",
      icon: <FolderIcon />,
      url: `/students/${params.id}/documents`,
    },
  ];
  const others = [
    {
      name: "print",
      icon: <PrinterIcon />,
      url: `/students/${params.id}/print`,
    },
  ];
  const menus = { informations, academy, school_life, others };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent>
        {/* <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={t("back")}>
                <Link href={"/students"}>
                  <ArrowLeft />
                  <span>{t("back")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup> */}
        <MenuSideGroup items={menus.informations} label="information" />
        <MenuSideGroup label="academy" items={menus.academy} />
        <MenuSideGroup label="school_life" items={menus.school_life} />
        <MenuSideGroup label="others" items={menus.others} />
      </SidebarContent>
    </Sidebar>
  );
}

function MenuSideGroup({
  items,
  label,
}: {
  items: { name: string; url: string; icon: ReactNode }[];
  label: string;
}) {
  const t = useTranslations();
  const pathname = usePathname();
  const params = useParams<{ id?: string }>();
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
              <Link href={params.id == undefined ? "/students" : item.url}>
                {item.icon}
                <span>{t(item.name)}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
