"use client";

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
import {
  ArrowLeft,
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
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useLocale } from "~/i18n";
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
        name: "reportcards",
        url: `/classrooms/${params.id}/reportcards`,
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
  const pathname = usePathname();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
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
        </SidebarGroup>

        <SidebarGroup className="pt-0">
          {/* <SidebarGroupLabel>{t("information")}</SidebarGroupLabel> */}
          <SidebarMenu>
            {data.information.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  asChild
                  tooltip={t(item.name)}
                  //className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:hover:bg-primary/90 data-[active=true]:hover:text-primary-foreground data-[active=true]:duration-200 data-[active=true]:ease-linear"
                  isActive={pathname === item.url}
                >
                  <Link href={item.url}>
                    <item.icon
                      className="text-muted-foreground/60 group-data-[active=true]/menu-button:text-primary"
                      size={22}
                      aria-hidden="true"
                    />
                    <span>{t(item.name)}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
