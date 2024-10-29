import * as React from "react";
import { Check, ChevronRight } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/ui/collapsible";
import { Separator } from "@repo/ui/separator";

export function Calendars() {
  const calendars = [
    {
      name: "My Calendars",
      items: ["Personal", "Work", "Family"],
    },
    {
      name: "Favorites",
      items: ["Holidays", "Birthdays"],
    },
    {
      name: "Other",
      items: ["Travel", "Reminders", "Deadlines"],
    },
  ];
  return (
    <>
      {calendars.map((calendar, index) => (
        <React.Fragment key={calendar.name}>
          <div key={calendar.name} className="py-0">
            <Collapsible
              defaultOpen={index === 0}
              className="group/collapsible"
            >
              <CollapsibleTrigger className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-full text-sm">
                {calendar.name}{" "}
                <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>

              <CollapsibleContent className="py-2">
                {calendar.items.map((item, index) => (
                  <div
                    className="flex flex-row items-center gap-2 py-1 text-sm"
                    key={item}
                  >
                    <div
                      data-active={index < 2}
                      className="group/calendar-item border-sidebar-border text-sidebar-primary-foreground data-[active=true]:border-sidebar-primary data-[active=true]:bg-sidebar-primary flex aspect-square size-4 shrink-0 items-center justify-center rounded-sm border"
                    >
                      <Check className="hidden size-3 group-data-[active=true]/calendar-item:block" />
                    </div>
                    {item}
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </div>
          <Separator className="mx-0" />
        </React.Fragment>
      ))}
    </>
  );
}
