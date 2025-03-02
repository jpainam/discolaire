"use client";
import { Search } from "lucide-react";

import { Label } from "@repo/ui/components/label";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
} from "@repo/ui/components/sidebar";
import { useLocale } from "~/i18n";

export function SearchForm({ ...props }: React.ComponentProps<"form">) {
  const { t } = useLocale();
  return (
    <SidebarGroup className="py-0 group-data-[collapsible=icon]:hidden">
      <SidebarGroupContent>
        <form className="relative" {...props}>
          <Label htmlFor="search" className="sr-only">
            {t("sarch")}
          </Label>
          <SidebarInput
            id="search"
            placeholder={t("search")}
            className="pl-8"
          />
          <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
        </form>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
