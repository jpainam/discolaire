"use client";

import {
  CalendarDays,
  DollarSign,
  Inbox,
  Image as LucideImage,
  Mails,
  RefreshCcw,
  School,
  Settings,
  Users,
  UserSearch,
} from "lucide-react";

import { useLocale } from "@repo/i18n";
import { Separator } from "@repo/ui/components/separator";

import { cn } from "~/lib/utils";
import { AdminNav } from "./admin-nav";

interface AdminSidebarProps {
  className?: string;
}
export function AdminSidebar({ className }: AdminSidebarProps) {
  const { t } = useLocale();
  //const { data: users } = useAtomValue(usersAtom);
  //const users: any[] = [];

  //const classroomsQuery = api.classroom.all.useQuery();
  //const { createQueryString } = useCreateQueryString();
  return (
    <div className={cn("h-[calc(100vh-10rem)]", className)}>
      <AdminNav
        //isCollapsed={isCollapsed}
        links={[
          {
            title: t("administration"),
            label: "",
            icon: Settings,
            variant: "ghost",
            href: `/administration`,
          },
          {
            title: t("students"),
            label: "",
            icon: UserSearch,
            variant: "ghost",
            href: `/administration/students`,
          },
          {
            title: t("classrooms"),
            label: "0",
            icon: Inbox,
            variant: "default",
            href: `/administration/classrooms`,
          },
          {
            title: t("users"),
            label: "29",
            icon: Users,
            variant: "ghost",
            href: `/administration/users`,
          },
          {
            title: t("photos"),
            label: "",
            icon: LucideImage,
            variant: "ghost",
            href: `/administration/photos`,
          },
          {
            title: t("transactions"),
            label: "",
            icon: DollarSign,
            href: `/administration/transactions`,
          },
          {
            title: t("fees"),
            label: "",
            icon: DollarSign,
            variant: "ghost",
            href: `/administration/fees`,
          },
          {
            title: "Grade options",
            label: "",
            icon: Users,
            href: `/administration/grade-options`,
          },
          {
            title: t("prospects"),
            label: "",
            icon: Users,
            href: `/administration/prospects`,
          },
          {
            title: "SMS Management",
            label: "",
            icon: Mails,
            href: `/administration/sms-management`,
          },
          {
            title: t("schoolYear"),
            label: "",
            icon: School,
            href: `/administration/school-years`,
          },
          {
            title: t("school_noticeboard"),
            label: "",
            icon: Users,
            href: `/administration/announcement`,
          },
          {
            title: t("calendar"),
            label: "",
            icon: CalendarDays,
            variant: "ghost",
            href: `/administration/event-calendar`,
          },
        ]}
      />
      <Separator />
      <AdminNav
        //isCollapsed={isCollapsed}
        links={[
          {
            title: t("system"),
            label: "",
            icon: Settings,
            variant: "ghost",
            href: `/administration/systems`,
          },
          {
            title: t("synchronization"),
            label: "",
            icon: RefreshCcw,
            variant: "ghost",
            href: `/administration/sync`,
          },
        ]}
      />
    </div>
  );
}
