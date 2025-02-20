"use client";

import { Plus } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import { Calendar } from "@repo/ui/components/calendar";

import { Calendars } from "~/components/timetables/calendars";

export function TimetableSidebar() {
  return (
    <div className="flex flex-col gap-2 border-r">
      <Calendar />
      <Calendars />
      <div>
        <Button variant={"ghost"} size={"sm"}>
          <Plus className="mr-2 h-4 w-4" />
          <span>New Calendar</span>
        </Button>
      </div>
    </div>
  );
}
