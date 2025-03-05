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

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useLocale } from "~/i18n";
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
  const pathname = usePathname();
  console.log(">>>>>>>>>", params.id);
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="h-16 max-md:mt-2 mb-2 justify-center">
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent className="-mt-2">
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={t("back_to_home")}>
                <Link href={"/students"}>
                  <ArrowLeft />
                  <span>{t("back_to_home")}</span>
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
                  disabled={true}
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
