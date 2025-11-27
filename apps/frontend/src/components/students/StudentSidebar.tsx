"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  Ambulance,
  ArrowRightLeft,
  BellRing,
  BookText,
  CalendarDays,
  CaptionsIcon,
  CircleDollarSign,
  CircleUserIcon,
  ContactIcon,
  CreditCard,
  FileText,
  KeySquare,
  LineChart,
  Mail,
  NotebookPen,
  NotepadTextDashed,
  PrinterIcon,
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
} from "@repo/ui/components/sidebar";

import { useCheckPermission } from "~/hooks/use-permission";
import { PermissionAction } from "~/permissions";
import { SidebarLogo } from "../sidebar-logo";

export function StudentSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const params = useParams<{ id: string }>();
  const informations = [
    {
      name: "profile",
      icon: CircleUserIcon,
      url: `/students/${params.id}`,
    },
    {
      name: "contacts",
      icon: ContactIcon,
      url: `/students/${params.id}/contacts`,
    },
    {
      name: "id_card",
      icon: CreditCard,
      url: `/students/${params.id}/id-card`,
    },
    {
      name: "login_info",
      icon: KeySquare,
      url: `/students/${params.id}/login-info`,
    },
  ];
  const academy = [
    {
      name: "enrollments",
      icon: ArrowRightLeft,
      url: `/students/${params.id}/enrollments`,
    },
    {
      name: "grades",
      icon: NotepadTextDashed,
      url: `/students/${params.id}/grades`,
    },
    {
      name: "transcripts",
      icon: CaptionsIcon,
      url: `/students/${params.id}/gradesheets`,
    },
    {
      name: "reportcards",
      icon: BookText,
      url: `/students/${params.id}/reportcards`,
    },
    {
      name: "assignments",
      icon: NotebookPen,
      url: `/students/${params.id}/assignments`,
    },
  ];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const canReadTransaction = useCheckPermission(
    "transaction",
    PermissionAction.READ,
  );
  //if (!canReadTransaction) {
  informations.push({
    name: "transactions",
    icon: CircleDollarSign,
    url: `/students/${params.id}/transactions`,
  });
  //}
  const school_life = [
    {
      name: "attendances",
      icon: LineChart,
      url: `/students/${params.id}/attendances`,
    },
    {
      name: "timetables",
      icon: CalendarDays,
      url: `/students/${params.id}/timetables`,
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
  ];
  const others = [
    {
      name: "print",
      icon: PrinterIcon,
      url: `/students/${params.id}/print`,
    },
  ];
  const menus = { informations, academy, school_life, others };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
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
              className="h-7 text-sm"
              tooltip={t(item.name)}
              isActive={pathname === item.url}
            >
              <Link href={item.url}>
                <item.icon />
                <span>{t(item.name)}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
