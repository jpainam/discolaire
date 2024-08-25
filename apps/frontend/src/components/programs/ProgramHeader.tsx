"use client";

import { useQueryState } from "nuqs";

import { useLocale } from "~/hooks/use-locale";
import { DatePicker } from "../shared/date-picker";
import { ToggleSelector } from "../shared/forms/toggle-selector";
import { ProgramThemeSelector } from "../shared/selects/ProgramThemeSelector";
import { Label } from "../ui/label";

export function ProgramHeader() {
  const { t } = useLocale();

  const [theme, setTheme] = useQueryState("theme");
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
        defaultValue={"1"}
        onChange={setToggle}
      />
      <Label>{t("since")}</Label>
      <DatePicker className="size-sm w-[200px]" />
      <ProgramThemeSelector
        onChange={(val) => {
          setTheme(val);
        }}
      />
    </div>
  );
}
