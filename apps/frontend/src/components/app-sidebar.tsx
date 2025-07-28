"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import type { Sidebar } from "@repo/ui/components/sidebar";

import { StudentSidebar } from "~/components/students/StudentSidebar";
import { MainSidebar } from "~/sidebars/main-sidebar";
import { AdminSidebar } from "./administration/admin-sidebar";
//import { TimetableSidebar } from "./timetables/TimetableSidebar";
import { AiChatSidebar } from "./ai/AiChatSidebar";
import { ClassroomSidebar } from "./classrooms/ClassroomSidebar";
import { ContactSidebar } from "./contacts/ContactSidebar";
import { StaffSidebar } from "./staffs/StaffSidebar";
import { UserSidebar } from "./users/UserSidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();
  const isHome =
    pathname === "/" ||
    pathname === "/students" ||
    pathname === "/classrooms" ||
    pathname === "/contacts" ||
    pathname === "/library" ||
    pathname === "/cards" ||
    pathname === "/staffs";
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
    pathname.startsWith("/staffs") && pathname.split("/").length > 2;

  const isAi = pathname.startsWith("/ai");

  //const isTimetable = pathname.startsWith("/timetables");

  React.useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return <></>;
  }

  return (
    <>
      {isClassroom && <ClassroomSidebar {...props} />}
      {isHome && <MainSidebar {...props} />}
      {isStudent && <StudentSidebar {...props} />}
      {isAdmin && <AdminSidebar {...props} />}
      {isAi && <AiChatSidebar {...props} />}
      {isUser && <UserSidebar {...props} />}
      {isContact && <ContactSidebar {...props} />}
      {isStaff && <StaffSidebar {...props} />}
      {/* {isTimetable && <TimetableSidebar {...props} />} */}
    </>
  );
}
