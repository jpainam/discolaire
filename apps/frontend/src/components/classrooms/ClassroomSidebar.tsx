"use client";

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/ui/components/sidebar";
import {
  BookOpenText,
  BookText,
  CalendarDays,
  Captions,
  Contact,
  FolderOpen,
  HandCoins,
  NotebookPen,
  NotepadTextDashed,
  Printer,
  Proportions,
  Receipt,
  TableProperties,
  Users,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useLocale } from "~/i18n";

export function ClassroomSidebar() {
  const params = useParams<{ id: string }>();
  const data = {
    information: [
      {
        name: "details",
        url: `/classrooms/${params.id}`,
        icon: TableProperties,
      },
      {
        name: "enrollments",
        url: `/classrooms/${params.id}/enrollments`,
        icon: Users,
      },

      {
        name: "fees",
        url: `/classrooms/${params.id}/fees`,
        icon: Receipt,
      },
      {
        name: "financial_situation",
        url: `/classrooms/${params.id}/financial_situation`,
        icon: HandCoins,
      },
      {
        name: "documents",
        url: `/classrooms/${params.id}/documents`,
        icon: FolderOpen,
      },

      {
        name: "assignments",
        url: `/classrooms/${params.id}/assignments`,
        icon: NotebookPen,
      },
      {
        name: "gradesheets",
        url: `/classrooms/${params.id}/gradesheets`,
        icon: BookOpenText,
      },

      {
        name: "print",
        url: `/classrooms/${params.id}/print`,
        icon: Printer,
      },

      {
        name: "subjects",
        url: `/classrooms/${params.id}/subjects`,
        icon: Captions,
      },
      {
        name: "programs",
        url: `/classrooms/${params.id}/programs`,
        icon: BookText,
      },
      {
        name: "attendances",
        url: `/classrooms/${params.id}/attendances`,
        icon: Contact,
      },
      {
        name: "report_cards",
        url: `/classrooms/${params.id}/report_cards`,
        icon: Proportions,
      },
      {
        name: "timetables",
        url: `/classrooms/${params.id}/timetables`,
        icon: CalendarDays,
      },
      {
        name: "subject_journal",
        url: `/classrooms/${params.id}/subject_journal`,
        icon: NotepadTextDashed,
      },
    ],
  };

  const { t } = useLocale();
  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>{t("information")}</SidebarGroupLabel>
        <SidebarMenu>
          {data.information.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild tooltip={t(item.name)}>
                <a href={item.url}>
                  <item.icon />
                  <span>{t(item.name)}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
      {/* <SidebarGroup>
        <SidebarGroupLabel>{t("academics")}</SidebarGroupLabel>
        <SidebarMenu>
          {data.academics.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild tooltip={t(item.name)}>
                <Link href={item.url}>
                  <item.icon />
                  <span>{t(item.name)}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>{t("others")}</SidebarGroupLabel>
        <SidebarMenu>
          {data.finances.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild tooltip={t(item.name)}>
                <a href={item.url}>
                  <item.icon />
                  <span>{t(item.name)}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup> */}
    </SidebarContent>
  );
}
