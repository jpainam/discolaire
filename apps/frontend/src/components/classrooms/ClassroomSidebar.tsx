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
import Image from "next/image";
import { useParams, usePathname } from "next/navigation";
import { useLocale } from "~/i18n";
import { SearchForm } from "../search-form";
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
  const pathname = usePathname();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center px-2  pt-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg ">
            {/* <GalleryVerticalEnd className="h-4 w-4" /> */}
            <Image
              alt="logo"
              src={"/images/logo.png"}
              width={100}
              height={100}
            />
          </div>

          <div className="ml-2 text-lg font-semibold group-data-[collapsible=icon]:hidden">
            Discolaire
          </div>
        </div>
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={t("back_to_home")}>
                <a href={"/"}>
                  <ArrowLeft
                    className="text-muted-foreground/60 group-data-[active=true]/menu-button:text-primary"
                    size={22}
                    aria-hidden="true"
                  />
                  <span>{t("back_to_home")}</span>
                </a>
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
                  isActive={pathname === item.url}
                >
                  <a href={item.url}>
                    <item.icon
                      className="text-muted-foreground/60 group-data-[active=true]/menu-button:text-primary"
                      size={22}
                      aria-hidden="true"
                    />
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
      <SidebarRail />
    </Sidebar>
  );
}
