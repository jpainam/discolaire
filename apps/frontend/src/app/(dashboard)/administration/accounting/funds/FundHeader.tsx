"use client";

import { format } from "date-fns";
import { useTranslations } from "next-intl";

import { DateRangePicker } from "~/components/DateRangePicker";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useRouter } from "~/hooks/use-router";

export function FundHeader() {
  const t = useTranslations();
  const router = useRouter();
  const { createQueryString } = useCreateQueryString();
  return (
    <div className="flex flex-row items-center gap-4 px-4 pt-2">
      <Label>Compte caisse</Label>
      <DateRangePicker
        className="w-76"
        onSelectAction={(val) => {
          if (val?.from && val.to) {
            router.push(
              `/administration/accounting/funds?${createQueryString({ from: format(val.from, "yyyy-MM-dd"), to: format(val.to, "yyyy-MM-dd") })}`,
            );
          } else {
            router.push(
              `/administration/accounting/funds?${createQueryString({ from: null, to: null })}`,
            );
          }
        }}
      />
      <div className="ml-auto flex flex-row items-center gap-4">
        <Button variant={"secondary"} size={"sm"}>
          <PDFIcon />
          {t("pdf_export")}
        </Button>
        <Button variant={"secondary"} size={"sm"}>
          <XMLIcon />
          {t("xml_export")}
        </Button>
      </div>
    </div>
  );
}
