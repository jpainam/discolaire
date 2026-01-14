"use client";

import { useTranslations } from "next-intl";

import PDFIcon from "~/components/icons/pdf-solid";
import { Button } from "~/components/ui/button";
import { useRouter } from "~/hooks/use-router";
import { PlusIcon } from "~/icons";

export function SalaryHeader() {
  const t = useTranslations();
  const router = useRouter();
  return (
    <div className="flex-items flex px-4">
      <div className="ml-auto flex items-center gap-4">
        <Button variant={"secondary"}>
          <PDFIcon />
          {t("pdf_export")}
        </Button>
        <Button
          onClick={() => {
            router.push(`/administration/accounting/salary/create`);
          }}
        >
          <PlusIcon />
          {t("add")}
        </Button>
      </div>
    </div>
  );
}
