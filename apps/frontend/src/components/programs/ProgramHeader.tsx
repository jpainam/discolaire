"use client";

import { useLocale } from "@/hooks/use-locale";
import { useQueryState } from "nuqs";
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
    <div className="bg-muted text-sm  gap-4 flex items-center flex-row px-4 py-1">
      <div className="flex ">{t("content_and_educational_ressources")}</div>
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
