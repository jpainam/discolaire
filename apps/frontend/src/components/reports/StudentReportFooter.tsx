"use client";

import { useAtom } from "jotai";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";

import { studentReportsAtom } from "~/atoms/report-atom";

export function StudentReportFooter() {
  const [reportsStudent, setReportsStudent] = useAtom(studentReportsAtom);
  const { t } = useLocale();

  return (
    <>
      <Button
        onClick={() => {
          setReportsStudent([]);
        }}
        size={"sm"}
        variant={"outline"}
      >
        {t("reset")}
      </Button>
      <Button
        onClick={() => {
          // toast.promise(publishMultipleReportQueue(reportsStudent), {
          //   loading: t("loading"),
          //   success: () => {
          //     setReportsStudent([]);
          //     router.push(routes.reports.index);
          //     return t("success");
          //   },
          //   error: (error) => {
          //     console.error(error);
          //     return getErrorMessage(error);
          //   },
          // });
        }}
        size={"sm"}
      >
        {t("print")} - ({reportsStudent.length})
      </Button>
    </>
  );
}
