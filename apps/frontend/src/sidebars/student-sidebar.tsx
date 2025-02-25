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
  Ambulance,
  ArrowRightLeft,
  BellRing,
  BookText,
  CircleDollarSign,
  CreditCard,
  FileText,
  Image,
  KeySquare,
  LineChart,
  Logs,
  Mail,
  NotebookPen,
  NotepadTextDashed,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";

import { useParams } from "next/navigation";
import { useLocale } from "~/i18n";

export function StudentSidebar() {
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
        icon: Image,
        url: `/students/${params.id}/photos`,
      },
    ],
    academic: [
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
    ],
    others: [
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
      <SidebarGroup>
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
      </SidebarGroup>
    </SidebarContent>
  );
}
