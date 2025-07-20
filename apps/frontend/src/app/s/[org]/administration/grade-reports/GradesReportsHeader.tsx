"use client";

import { Label } from "@repo/ui/components/label";

import { ClassroomSelector } from "~/components/shared/selects/ClassroomSelector";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useRouter } from "~/hooks/use-router";
import { useLocale } from "~/i18n";

export function GradesReportsHeader() {
  const { t } = useLocale();
  const router = useRouter();
  const { createQueryString } = useCreateQueryString();
  return (
    <div className="flex w-full flex-row items-center gap-8 border-b px-4">
      <div className="flex flex-row items-center gap-2">
        <Label>{t("classrooms")}</Label>
        <ClassroomSelector
          className="w-[300px]"
          onChange={(val) => {
            router.push(
              `/administration/grades-reports?${createQueryString({ classroom: val })}`,
            );
          }}
        />
      </div>
      <div className="flex flex-row items-center gap-2">
        <Label>{t("term")}</Label>
        <TermSelector
          className="w-[300px]"
          onChange={(val) => {
            router.push(
              `/administration/grades-reports?${createQueryString({ classroom: val })}`,
            );
          }}
        />
      </div>
    </div>
  );
}
