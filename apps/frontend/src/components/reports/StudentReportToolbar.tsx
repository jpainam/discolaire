"use client";

import { useLocale } from "@repo/i18n";
import { ToggleGroup } from "@repo/ui/ToggleGroup";

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { StudentSelector } from "~/components/shared/selects/StudentSelector";
import { routes } from "~/configs/routes";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useRouter } from "~/hooks/use-router";
import { Label } from "../ui/label";

export function StudentReportToolbar() {
  const { t } = useLocale();
  const { createQueryString } = useCreateQueryString();
  const router = useRouter();
  const options = [
    {
      value: "pdf",
      label: "Pdf",
      iconLeft: <PDFIcon className="h-6 w-6" />,
    },
    {
      value: "excel",
      label: "Excel",
      iconLeft: <XMLIcon className="h-6 w-6" />,
    },
  ];
  return (
    <>
      <Label>{t("students")}</Label>
      <StudentSelector
        className="w-[500px]"
        onChange={(studentId) => {
          if (studentId) {
            router.push(
              `${routes.reports.students}/?${createQueryString({ id: studentId })}`,
            );
          } else {
            router.push(`${routes.reports.students}`);
          }
        }}
      />
      <ToggleGroup
        onValueChange={(val) => {
          if (val) {
            router.push(
              `${routes.reports.students}/?${createQueryString({ type: val })}`,
            );
          } else {
            router.push(
              `${routes.reports.students}/?${createQueryString({ type: null })}`,
            );
          }
        }}
        options={options}
      />
    </>
  );
}
