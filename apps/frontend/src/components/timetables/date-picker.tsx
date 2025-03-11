import { Calendar } from "@repo/ui/components/calendar";
import { SidebarGroup, SidebarGroupContent } from "@repo/ui/components/sidebar";

export function DatePicker() {
  return (
    <SidebarGroup className="pr-0 pl-2">
      <SidebarGroupContent>
        <Calendar className="[&_[role=gridcell].bg-accent]:bg-sidebar-primary [&_[role=gridcell].bg-accent]:text-sidebar-primary-foreground [&_[role=gridcell]]:w-[32px]" />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
