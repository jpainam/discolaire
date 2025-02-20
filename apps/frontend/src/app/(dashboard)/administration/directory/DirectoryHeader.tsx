"use client";

import { useQueryState } from "nuqs";
import { useDebouncedCallback } from "use-debounce";

import { useLocale } from "@repo/i18n";
import { Input } from "@repo/ui/components/input";

export default function DirectoryHeader() {
  const { t } = useLocale();
  const [_, setSearchText] = useQueryState("q", {
    shallow: false,
  });
  const debounced = useDebouncedCallback((value) => {
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
