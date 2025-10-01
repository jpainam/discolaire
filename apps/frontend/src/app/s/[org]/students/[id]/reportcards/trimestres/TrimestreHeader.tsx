"use client";

import { FileSliders, Printer } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import { Label } from "@repo/ui/components/label";

import { useCreateQueryString } from "~/hooks/create-query-string";
import { useCheckPermission } from "~/hooks/use-permission";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";

export function TrimestreHeader({
  studentId,
  classroomId,
  title,
  trimestreId,
}: {
  studentId: string;
  title: string;
  classroomId: string;
  trimestreId: string;
}) {
  const { createQueryString } = useCreateQueryString();
  const { t } = useLocale();
  const canCreateReportCard = useCheckPermission(
    "reportcard",
    PermissionAction.CREATE,
  );
  return (
    <div className="flex flex-row items-center justify-between gap-2 px-4">
      <FileSliders className="h-4 w-4" />
      <Label>{title}</Label>

      {canCreateReportCard && (
        <Button
          onClick={() => {
            const url =
              `/api/pdfs/reportcards/ipbw/trimestres?` +
              createQueryString({
                trimestreId: trimestreId,
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
      )}
    </div>
  );
}
