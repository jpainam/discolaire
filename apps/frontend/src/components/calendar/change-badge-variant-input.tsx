"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { useCalendar } from "~/components/calendar/calendar-context";

export function ChangeBadgeVariantInput() {
  const { badgeVariant, setBadgeVariant } = useCalendar();

  return (
    // <div className="space-y-1 flex flex-row">
    // {/* <p className="text-sm font-semibold">Variant</p> */}

    <Select value={badgeVariant} onValueChange={setBadgeVariant}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        <SelectItem value="dot">Dot</SelectItem>
        <SelectItem value="colored">Colored</SelectItem>
      </SelectContent>
    </Select>
    // </div>
  );
}
