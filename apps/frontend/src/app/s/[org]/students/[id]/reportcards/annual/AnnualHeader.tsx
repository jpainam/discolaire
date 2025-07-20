"use client";

import { FileSliders, Printer } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import { Label } from "@repo/ui/components/label";

import { useCreateQueryString } from "~/hooks/create-query-string";
import { useLocale } from "~/i18n";

export function AnnualHeader({
  studentId,
  classroomId,
}: {
  studentId: string;
  classroomId: string;
}) {
  const { createQueryString } = useCreateQueryString();
  const { t } = useLocale();
  return (
    <div className="flex flex-row items-center justify-between gap-2 px-4">
      <FileSliders className="h-4 w-4" />
      <Label>BULLETIN ANNUEL</Label>

      <Button
        onClick={() => {
          const url =
            `/api/pdfs/reportcards/ipbw/annual?` +
            createQueryString({
              classroomId: classroomId,
              studentId: studentId,
              format: "pdf",
            });
          window.open(url, "_blank");
        }}
        variant={"default"}
        size={"sm"}
      >
        <Printer />
        {t("print")}
      </Button>
    </div>
  );
}
