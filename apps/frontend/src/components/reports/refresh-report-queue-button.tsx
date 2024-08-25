"use client";

import { useLocale } from "@/hooks/use-locale";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "@repo/ui/button";

export function RefreshReportQueueButton() {
  const { t } = useLocale();
  return (
    <Button className="h-7 w-7" variant={"ghost"} size={"icon"}>
      <ReloadIcon className="h-4 w-4 animate-spin" />
      {/* {t("refresh")} */}
    </Button>
  );
}
