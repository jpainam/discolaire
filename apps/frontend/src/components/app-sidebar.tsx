"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import type { Sidebar } from "~/components/ui/sidebar";
import { MainSidebar } from "~/components/MainSidebar";
import { StudentSidebar } from "~/components/students/StudentSidebar";
import { cn } from "~/lib/utils";
import { AdminSidebar } from "./administration/admin-sidebar";
//import { TimetableSidebar } from "./timetables/TimetableSidebar";
import { ClassroomSidebar } from "./classrooms/ClassroomSidebar";
import { ContactSidebar } from "./contacts/ContactSidebar";
import { StaffSidebar } from "./staffs/StaffSidebar";
import { TimetableSidebar } from "./timetables/TimetableSidebar";
import { UserSidebar } from "./users/UserSidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [mounted, setMounted] = React.useState(false);
  const keepHomePaths = [
    "/",
    "/students",
    "/classrooms",
    "/contacts",
    "/library",
    "/cards",
    "/staffs",
    "/staffs/create",
    "/staffs/attendances",
  ];
  const pathname = usePathname();
  const isHome = keepHomePaths.includes(pathname);
  const segments = pathname.split("/").filter(Boolean);
  const isStudent =
    pathname.startsWith("/students") && pathname.split("/").length > 2;

  const isAdmin = pathname.startsWith("/administration");
  const isClassroom =
    pathname.startsWith("/classrooms") && pathname.split("/").length > 2;

  const isUser =
    pathname.startsWith("/users") && pathname.split("/").length > 2;

  const isContact =
    pathname.startsWith("/contacts") && pathname.split("/").length > 2;

  const isStaff =
    segments[0] === "staffs" &&
    segments.length > 1 &&
    !["create", "attendances"].includes(segments[1] ?? "");

  const isTimetable = pathname.startsWith("/timetables");

  React.useEffect(() => {
    setMounted(true);
  }, []);
  const activeSidebar = React.useMemo(() => {
    if (isClassroom) {
      return {
        key: "classroom",
        Component: ClassroomSidebar,
      };
    }
    if (isTimetable) {
      return {
        key: "timetable",
        Component: TimetableSidebar,
      };
    }
    if (isHome) {
      return {
        key: "home",
        Component: MainSidebar,
      };
    }
    if (isStudent) {
      return {
        key: "student",
        Component: StudentSidebar,
      };
    }
    if (isAdmin) {
      return {
        key: "admin",
        Component: AdminSidebar,
      };
    }
    if (isUser) {
      return {
        key: "user",
        Component: UserSidebar,
      };
    }
    if (isContact) {
      return {
        key: "contact",
        Component: ContactSidebar,
      };
    }
    if (isStaff) {
      return {
        key: "staff",
        Component: StaffSidebar,
      };
    }
    return null;
  }, [isAdmin, isClassroom, isContact, isHome, isStaff, isStudent, isUser]);

  if (!mounted || !activeSidebar) {
    return null;
  }

  const ActiveSidebar = activeSidebar.Component;

  return (
    <ActiveSidebar
      key={activeSidebar.key}
      {...props}
      className={cn(
        props.className,
        "animate-in slide-in-from-right-8 duration-300 motion-reduce:animate-none",
      )}
    />
  );
}
