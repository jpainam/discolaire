"use client";

import type { Sidebar } from "@repo/ui/components/sidebar";
import { usePathname } from "next/navigation";
import * as React from "react";
import { StudentSidebar } from "~/components/students/StudentSidebar";
import { MainSidebar } from "~/sidebars/main-sidebar";
import { AdminSidebar } from "./administration/admin-sidebar";
import { ClassroomSidebar } from "./classrooms/ClassroomSidebar";
import { ContactSidebar } from "./contacts/ContactSidebar";
import { StaffSidebar } from "./staffs/StaffSidebar";
import { UserSidebar } from "./users/UserSidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const isHome =
    pathname === "/" ||
    pathname === "/students" ||
    pathname === "/classrooms" ||
    pathname === "/contacts" ||
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

  return (
    <>
      {isClassroom && <ClassroomSidebar {...props} />}
      {isHome && <MainSidebar {...props} />}
      {isStudent && <StudentSidebar {...props} />}
      {isAdmin && <AdminSidebar {...props} />}
      {isUser && <UserSidebar {...props} />}
      {isContact && <ContactSidebar {...props} />}
      {isStaff && <StaffSidebar {...props} />}
    </>
  );
}
