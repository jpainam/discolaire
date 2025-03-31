"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { useCalendar } from "~/components/calendar/calendar-context";
import { useLocale } from "~/i18n";

export function ChangeBadgeVariantInput() {
  const { badgeVariant, setBadgeVariant } = useCalendar();
  const { t } = useLocale();

  return (
    // <div className="space-y-1 flex flex-row">
    // {/* <p className="text-sm font-semibold">Variant</p> */}

    <Select value={badgeVariant} onValueChange={setBadgeVariant}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        <SelectItem value="dot">{t("Dot")}</SelectItem>
        <SelectItem value="colored">{t("Colored")}</SelectItem>
      </SelectContent>
    </Select>
    // </div>
  );
}
