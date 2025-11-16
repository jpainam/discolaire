"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
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
  Printer,
  Proportions,
  Receipt,
  SendIcon,
  TableProperties,
  Users,
} from "lucide-react";
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
  SidebarRail,
} from "@repo/ui/components/sidebar";

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
        name: "School fees",
        url: `/classrooms/${params.id}/fees`,
        icon: Receipt,
      },
      {
        name: "financial_situation",
        url: `/classrooms/${params.id}/financial_situation`,
        icon: HandCoins,
      },
    ],
    school_life: [
      {
        name: "attendances",
        url: `/classrooms/${params.id}/attendances`,
        icon: Contact,
      },
      {
        name: "timetables",
        url: `/classrooms/${params.id}/timetables`,
        icon: CalendarDays,
      },
    ],
    academy: [
      {
        name: "enrollments",
        url: `/classrooms/${params.id}/enrollments`,
        icon: Users,
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
        name: "subjects",
        url: `/classrooms/${params.id}/subjects`,
        icon: Captions,
      },

      {
        name: "reportcards",
        url: `/classrooms/${params.id}/reportcards`,
        icon: Proportions,
      },

      {
        name: "teaching_session",
        url: `/classrooms/${params.id}/teaching_session`,
        icon: BookText,
      },
    ],
  };

  const others = [
    {
      name: "documents",
      url: `/classrooms/${params.id}/documents`,
      icon: FolderOpen,
    },
    {
      name: "communications",
      url: `/classrooms/${params.id}/communications`,
      icon: SendIcon,
    },
    {
      name: "print",
      url: `/classrooms/${params.id}/print`,
      icon: Printer,
    },
  ];

  const { t } = useLocale();

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
        <MenuSideGroup label="Information" items={data.information} />
        <MenuSideGroup label="academy" items={data.academy} />
        <MenuSideGroup label="school_life" items={data.school_life} />
        <MenuSideGroup label="others" items={others} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

function MenuSideGroup({
  items,
  label,
}: {
  items: { name: string; url: string; icon: LucideIcon }[];
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
              //className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:hover:bg-primary/90 data-[active=true]:hover:text-primary-foreground data-[active=true]:duration-200 data-[active=true]:ease-linear"
              isActive={pathname === item.url}
            >
              <Link href={item.url}>
                <item.icon
                //className="text-muted-foreground/60 group-data-[active=true]/menu-button:text-primary"
                //size={22}
                //aria-hidden="true"
                />
                <span>{t(item.name)}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
