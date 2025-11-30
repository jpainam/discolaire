"use client";

import { useTranslations } from "next-intl";

import { Button } from "@repo/ui/components/button";
import { Label } from "@repo/ui/components/label";

import { DateRangePicker } from "~/components/DateRangePicker";
import { routes } from "~/configs/routes";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useRouter } from "~/hooks/use-router";

export function SMSHistoryHeader() {
  //const [status, setStatus] = useState<string | null>(null);

  const t = useTranslations();
  const router = useRouter();
  const { createQueryString } = useCreateQueryString();
  return (
    <div className="flex flex-row items-center gap-2">
      <Label>{t("date")}</Label>
      <DateRangePicker />
      {/* <StatusSelector
        onChange={(val) => {
          setStatus(val);
        }}
      /> */}
      <Button
        onClick={() => {
          router.push(
            // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
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
