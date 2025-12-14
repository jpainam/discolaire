"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

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
import {
  AttendanceIcon,
  CalendarDays,
  ChatIcon,
  EnrollmentIcon,
  FeeIcon,
  FileIcon,
  FilesIcon,
  FolderIcon,
  GradeIcon,
  MoneyIcon,
  PrinterIcon,
  ReportGradeIcon,
  SubjectIcon,
  TextBookIcon,
} from "~/icons";
import { SidebarLogo } from "../sidebar-logo";

export function ClassroomSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const params = useParams<{ id: string }>();
  const data = {
    information: [
      {
        name: "details",
        url: `/classrooms/${params.id}`,
        icon: <FilesIcon />,
      },
      {
        name: "School fees",
        url: `/classrooms/${params.id}/fees`,
        icon: <FeeIcon />,
      },
      {
        name: "financial_situation",
        url: `/classrooms/${params.id}/financial_situation`,
        icon: <MoneyIcon />,
      },
    ],
    school_life: [
      {
        name: "attendances",
        url: `/classrooms/${params.id}/attendances`,
        icon: <AttendanceIcon />,
      },
      {
        name: "timetables",
        url: `/classrooms/${params.id}/timetables`,
        icon: <CalendarDays />,
      },
    ],
    academy: [
      {
        name: "enrollments",
        url: `/classrooms/${params.id}/enrollments`,
        icon: <EnrollmentIcon />,
      },
      {
        name: "assignments",
        url: `/classrooms/${params.id}/assignments`,
        icon: <FileIcon />,
      },
      {
        name: "gradesheets",
        url: `/classrooms/${params.id}/gradesheets`,
        icon: <GradeIcon />,
      },

      {
        name: "subjects",
        url: `/classrooms/${params.id}/subjects`,
        icon: <SubjectIcon />,
      },

      {
        name: "reportcards",
        url: `/classrooms/${params.id}/reportcards`,
        icon: <ReportGradeIcon />,
      },

      {
        name: "teaching_session",
        url: `/classrooms/${params.id}/teaching_session`,
        icon: <TextBookIcon />,
      },
    ],
  };

  const others = [
    {
      name: "documents",
      url: `/classrooms/${params.id}/documents`,
      icon: <FolderIcon />,
    },
    {
      name: "communications",
      url: `/classrooms/${params.id}/communications`,
      icon: <ChatIcon />,
    },
    {
      name: "print",
      url: `/classrooms/${params.id}/print`,
      icon: <PrinterIcon />,
    },
  ];

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
                <Link href={"/classrooms"}>
                  <ArrowLeft />
                  <span>{t("back")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup> */}
        <MenuSideGroup label="Information" items={data.information} />
        <MenuSideGroup label="academy" items={data.academy} />
        <MenuSideGroup label="school_life" items={data.school_life} />
        <MenuSideGroup label="others" items={others} />
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
