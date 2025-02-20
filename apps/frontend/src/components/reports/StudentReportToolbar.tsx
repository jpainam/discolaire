"use client";

import { useCreateQueryString } from "@repo/hooks/create-query-string";
import { useLocale } from "@repo/i18n";
import { Label } from "@repo/ui/components/label";

import { StudentSelector } from "~/components/shared/selects/StudentSelector";
import { routes } from "~/configs/routes";
import { useRouter } from "~/hooks/use-router";

export function StudentReportToolbar() {
  const { t } = useLocale();
  const { createQueryString } = useCreateQueryString();
  const router = useRouter();
  // const options = [
  //   {
  //     value: "pdf",
  //     label: "Pdf",
  //     iconLeft: <PDFIcon className="h-6 w-6" />,
  //   },
  //   {
  //     value: "excel",
  //     label: "Excel",
  //     iconLeft: <XMLIcon className="h-6 w-6" />,
  //   },
  // ];
  return (
    <>
      <Label>{t("students")}</Label>
      <StudentSelector
        className="w-[500px]"
        onChange={(studentId: string) => {
          if (studentId) {
            router.push(
              `${routes.reports.students}/?${createQueryString({ id: studentId })}`,
            );
          } else {
            router.push(`${routes.reports.students}`);
          }
        }}
      />
      {/* <ToggleGroup
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
      /> */}
    </>
  );
}
