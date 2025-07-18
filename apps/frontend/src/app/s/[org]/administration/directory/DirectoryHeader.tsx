"use client";

import { useQueryState } from "nuqs";
import { useDebouncedCallback } from "use-debounce";

import { Input } from "@repo/ui/components/input";
import { useLocale } from "~/i18n";

export default function DirectoryHeader() {
  const { t } = useLocale();
  const [_, setSearchText] = useQueryState("q", {
    shallow: false,
  });
  const debounced = useDebouncedCallback((value: string) => {
    void setSearchText(value);
  }, 1000);

  return (
    <div>
      <Input
        className="w-96"
        onChange={(e) => debounced(e.target.value)}
        placeholder={t("search")}
      />
    </div>
  );
}
