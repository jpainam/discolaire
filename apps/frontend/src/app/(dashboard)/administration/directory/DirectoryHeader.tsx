"use client";

import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";
import { useDebouncedCallback } from "use-debounce";

import { Input } from "@repo/ui/components/input";

export default function DirectoryHeader() {
  const t = useTranslations();
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
