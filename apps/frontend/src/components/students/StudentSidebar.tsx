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
  Ambulance,
  ArrowLeft,
  ArrowRightLeft,
  BellRing,
  BookText,
  CircleDollarSign,
  CreditCard,
  FileText,
  ImageIcon,
  KeySquare,
  LineChart,
  Logs,
  Mail,
  NotebookPen,
  NotepadTextDashed,
  User,
  Users,
} from "lucide-react";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useLocale } from "~/i18n";
import { SearchForm } from "../search-form";
export function StudentSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const params = useParams<{ id: string }>();
  const data = {
    information: [
      {
        name: "profile",
        icon: User,
        url: `/students/${params.id}`,
      },
      {
        name: "contacts",
        icon: Users,
        url: `/students/${params.id}/contacts`,
      },
      {
        name: "id_card",
        icon: CreditCard,
        url: `/students/${params.id}/id-card`,
      },
      {
        name: "photos",
        icon: ImageIcon,
        url: `/students/${params.id}/photos`,
      },

      {
        name: "grades",
        icon: NotepadTextDashed,
        url: `/students/${params.id}/grades`,
      },
      {
        name: "report_cards",
        icon: BookText,
        url: `/students/${params.id}/report-cards`,
      },
      {
        name: "attendances",
        icon: LineChart,
        url: `/students/${params.id}/attendances`,
      },

      {
        name: "enrollments",
        icon: ArrowRightLeft,
        url: `/students/${params.id}/enrollments`,
      },

      {
        name: "assignments",
        icon: NotebookPen,
        url: `/students/${params.id}/assignments`,
      },
      {
        name: "transactions",
        icon: CircleDollarSign,
        url: `/students/${params.id}/transactions`,
      },

      {
        name: "login_info",
        icon: KeySquare,
        url: `/students/${params.id}/login-info`,
      },

      {
        name: "mail",
        icon: Mail,
        url: `/students/${params.id}/mail`,
      },
      {
        name: "health",
        icon: Ambulance,
        url: `/students/${params.id}/health`,
      },
      {
        name: "notifications",
        icon: BellRing,
        url: `/students/${params.id}/notifications`,
      },
      {
        name: "documents",
        icon: FileText,
        url: `/students/${params.id}/documents`,
      },
      {
        name: "access_logs",
        icon: Logs,
        url: `/students/${params.id}/access-logs`,
      },
    ],
  };
  const { t } = useLocale();
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
                  <ArrowLeft />
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
            {data.academic.map((item) => (
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
            {data.others.map((item) => (
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
