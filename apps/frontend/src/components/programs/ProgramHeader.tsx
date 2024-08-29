"use client";

import { parseAsString, useQueryState } from "nuqs";

import { useLocale } from "@repo/i18n";
import { Label } from "@repo/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@repo/ui/toggle-group";

import { DatePicker } from "../shared/date-picker";
import { ProgramThemeSelector } from "../shared/selects/ProgramThemeSelector";

export function ProgramHeader() {
  const { t } = useLocale();

  const [theme, setTheme] = useQueryState(
    "theme",
    parseAsString.withDefault("1"),
  );
  const [toggle, setToggle] = useQueryState("toggle", {
    defaultValue: "1",
  });

  return (
    <div className="flex flex-row items-center gap-4 bg-muted px-4 py-1 text-sm">
      <div className="flex">{t("content_and_educational_ressources")}</div>
      <ToggleGroup
        defaultValue={toggle}
        onValueChange={(val) => {
          void setToggle(val);
        }}
        type="single"
      >
        <ToggleGroupItem value="1">{t("chronological_view")}</ToggleGroupItem>
        <ToggleGroupItem value="2">{t("weekly_view")}</ToggleGroupItem>
      </ToggleGroup>

      <Label>{t("since")}</Label>
      <DatePicker className="size-sm w-[200px]" />
      <ProgramThemeSelector
        onChange={(val) => {
          console.log(theme);
          void setTheme(val);
        }}
      />
    </div>
  );
}
