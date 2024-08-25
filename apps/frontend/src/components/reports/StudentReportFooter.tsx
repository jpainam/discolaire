"use client";

import { studentReportsAtom } from "@/atoms/report-atom";
import { useLocale } from "@/hooks/use-locale";
import { useRouter } from "@/hooks/use-router";
import { Button } from "@repo/ui/button";
import { useAtom } from "jotai";

export function StudentReportFooter() {
  const [reportsStudent, setReportsStudent] = useAtom(studentReportsAtom);
  const { t } = useLocale();
  const router = useRouter();
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
