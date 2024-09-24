"use client";

import { subDays } from "date-fns";

import { useCreateQueryString } from "@repo/hooks/create-query-string";
import { useRouter } from "@repo/hooks/use-router";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { Label } from "@repo/ui/label";

import { DateRangePicker } from "~/components/shared/DateRangePicker";
import { routes } from "~/configs/routes";

export function SMSHistoryHeader() {
  const d = new Date();
  //const [status, setStatus] = useState<string | null>(null);
  const { t } = useLocale();
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
