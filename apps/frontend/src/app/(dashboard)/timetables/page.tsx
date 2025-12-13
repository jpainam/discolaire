// "use client";

import { SidebarProvider } from "~/components/ui/sidebar";
import { TimetableContainer } from "./TimetableContainer";

export default function Page() {
  return (
    <SidebarProvider
      style={
        {
          // "--sidebar-width": "14rem",
          // "--sidebar-width-mobile": "16rem",
        }
      }
      defaultOpen={true}
    >
      {/* <EventSidebar /> */}

      <div className="flex flex-1 flex-col gap-4 p-2 pt-0">
        <TimetableContainer />
      </div>
    </SidebarProvider>
  );
}
