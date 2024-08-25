"use client";

import { useState } from "react";
import { subDays } from "date-fns";

import { useLocale } from "@repo/i18n";
import { useRouter } from "@repo/lib/hooks/use-router";
import { Button } from "@repo/ui/button";
import { Label } from "@repo/ui/label";

import { DateRangePicker } from "~/components/shared/DateRangePicker";
import { routes } from "~/configs/routes";
import { useCreateQueryString } from "../../../hooks/create-query-string";

export function SMSHistoryHeader() {
  const d = new Date();
  const [status, setStatus] = useState<string | null>(null);
  const { t } = useLocale("admin");
  const router = useRouter();
  const { createQueryString } = useCreateQueryString();
  return (
    <div className="flex flex-row items-center gap-2">
      <Label>{t("date")}</Label>
      <DateRangePicker from={subDays(d, 20)} to={d} />
      {/* <StatusSelector
        onChange={(val) => {
          setStatus(val);
        }}
      /> */}
      <Button
        onClick={() => {
          router.push(
            `${routes.administration.sms_management}/?${createQueryString({})}`,
          );
        }}
        size={"sm"}
        className="h-8"
      >
        Valider
      </Button>
    </div>
  );
}
