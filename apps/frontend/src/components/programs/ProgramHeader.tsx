"use client";

import { parseAsString, useQueryState } from "nuqs";

import { useLocale } from "@repo/i18n";
import { Label } from "@repo/ui/label";

import { DatePicker } from "../shared/date-picker";
import { ToggleSelector } from "../shared/forms/toggle-selector";
import { ProgramThemeSelector } from "../shared/selects/ProgramThemeSelector";

export function ProgramHeader() {
  const { t } = useLocale();

  const [theme, setTheme] = useQueryState(
    "theme",
    parseAsString.withDefault("1"),
  );
  const [toggle, setToggle] = useQueryState("toggle");
  const toggleItems = [
    { value: "1", label: t("chronological_view") },
    { value: "2", label: t("weekly_view") },
  ];

  return (
    <div className="flex flex-row items-center gap-4 bg-muted px-4 py-1 text-sm">
      <div className="flex">{t("content_and_educational_ressources")}</div>
      <ToggleSelector
        items={toggleItems}
        defaultValue={theme}
        onChange={setToggle}
      />
      <Label>{t("since")}</Label>
      <DatePicker className="size-sm w-[200px]" />
      <ProgramThemeSelector
        onChange={(val) => {
          console.log(toggle);
          void setTheme(val);
        }}
      />
    </div>
  );
}
