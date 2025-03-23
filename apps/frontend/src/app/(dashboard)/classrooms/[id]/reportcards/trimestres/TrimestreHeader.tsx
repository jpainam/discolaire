"use client";

import { Button } from "@repo/ui/components/button";
import { Label } from "@repo/ui/components/label";
import { FileSliders, Printer } from "lucide-react";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useLocale } from "~/i18n";

export function TrimestreHeader({
  classroomId,
  title,
  trimestreId,
}: {
  title: string;
  classroomId: string;
  trimestreId: string;
}) {
  const { createQueryString } = useCreateQueryString();
  const { t } = useLocale();
  return (
    <div className="flex flex-row items-center justify-between">
      <FileSliders className="w-6 h-6" />
      <Label>{title}</Label>
      <Button
        onClick={() => {
          const url =
            `/api/pdfs/classroom/${classroomId}/trimestres?` +
            createQueryString({
              trimestreId: trimestreId,
              classroomId: classroomId,
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
