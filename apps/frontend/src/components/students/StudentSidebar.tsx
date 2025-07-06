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
  CalendarDays,
  CaptionsIcon,
  CircleDollarSign,
  CreditCard,
  FileText,
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
import { useParams, usePathname } from "next/navigation";
import { useCheckPermission } from "~/hooks/use-permission";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";
import { SidebarLogo } from "../sidebar-logo";
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
      // {
      //   name: "photos",
      //   icon: ImageIcon,
      //   url: `/students/${params.id}/photos`,
      // },

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
        name: "timetables",
        icon: CalendarDays,
        url: `/students/${params.id}/timetables`,
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
  const pathname = usePathname();
  const canReadTransaction = useCheckPermission(
    "transaction",
    PermissionAction.READ,
  );
  if (!canReadTransaction) {
    data.information = data.information.filter(
      (item) => item.name !== "transactions",
    );
  }

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
                <Link href={"/students"}>
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
                  //className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:hover:bg-primary/90 data-[active=true]:hover:text-primary-foreground data-[active=true]:duration-200 data-[active=true]:ease-linear"
                  //disabled={true}
                  tooltip={t(item.name)}
                  isActive={pathname === item.url}
                >
                  <Link
                    href={
                      item.url.includes("undefined") ? "/students" : item.url
                    }
                  >
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
