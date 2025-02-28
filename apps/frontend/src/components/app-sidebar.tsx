"use client";

import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  Users,
  Warehouse,
} from "lucide-react";
import * as React from "react";

import {
  Sidebar,
  SidebarHeader,
  SidebarRail,
} from "@repo/ui/components/sidebar";

import { usePathname } from "next/navigation";
import { StudentSidebar } from "~/components/students/StudentSidebar";
import { MainSidebar } from "~/sidebars/main-sidebar";
import { AdminSidebar } from "./administration/admin-sidebar";
import { ClassroomSidebar } from "./classrooms/ClassroomSidebar";
import { TeamSwitcher } from "./team-switcher";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],

  components: [
    {
      name: "students",
      url: "/students",
      icon: Users,
    },
    {
      name: "classrooms",
      url: "/classrooms",
      icon: Warehouse,
    },
    {
      name: "contacts",
      url: "/contacts",
      icon: Users,
    },
    {
      name: "staffs",
      url: "/staffs",
      icon: Users,
    },
  ],
};

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

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />

        {/* <SidebarGroup className="py-0 group-data-[collapsible=icon]:hidden">
          <SidebarGroupContent>
            <form className="relative">
              <Label htmlFor="search" className="sr-only">
                Search
              </Label>
              <SidebarInput
                id="search"
                placeholder="Search the docs..."
                className="pl-8"
              />
              <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
            </form>
          </SidebarGroupContent>
        </SidebarGroup> */}
      </SidebarHeader>
      {isClassroom && <ClassroomSidebar />}
      {isHome && (
        <MainSidebar />
        // <SidebarContent>
        //   <SidebarGroup>
        //     <SidebarGroupLabel>Home</SidebarGroupLabel>
        //     <SidebarMenu>
        //       {data.components.map((item) => (
        //         <SidebarMenuItem key={item.name}>
        //           <SidebarMenuButton asChild tooltip={item.name}>
        //             <a href={item.url}>
        //               <item.icon />
        //               <span>{t(item.name)}</span>
        //             </a>
        //           </SidebarMenuButton>
        //         </SidebarMenuItem>
        //       ))}
        //     </SidebarMenu>
        //   </SidebarGroup>
        // </SidebarContent>
      )}
      {isStudent && <StudentSidebar />}
      {isAdmin && <AdminSidebar />}
      {/* <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter> */}
      <SidebarRail />
    </Sidebar>
  );
}
