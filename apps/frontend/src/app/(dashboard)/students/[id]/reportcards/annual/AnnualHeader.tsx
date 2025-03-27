"use client";

import { Button } from "@repo/ui/components/button";
import { Label } from "@repo/ui/components/label";
import { FileSliders, Printer } from "lucide-react";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useLocale } from "~/i18n";

export function AnnualHeader({
  studentId,
  classroomId,
  title,
}: {
  studentId: string;
  title: string;
  classroomId: string;
}) {
  const { createQueryString } = useCreateQueryString();
  const { t } = useLocale();
  return (
    <div className="flex flex-row gap-2 items-center justify-between px-4">
      <FileSliders className="w-4 h-4" />
      <Label>{title}</Label>

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
