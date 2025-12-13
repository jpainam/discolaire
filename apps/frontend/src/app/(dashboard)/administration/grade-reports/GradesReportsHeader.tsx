"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { ClassroomSelector } from "~/components/shared/selects/ClassroomSelector";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { Label } from "~/components/ui/label";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useRouter } from "~/hooks/use-router";

export function GradesReportsHeader() {
  const t = useTranslations();
  const router = useRouter();
  const { createQueryString } = useCreateQueryString();
  const searchParams = useSearchParams();
  return (
    <div className="flex w-full flex-row items-center gap-8 border-b px-4">
      <div className="flex flex-row items-center gap-2">
        <Label>{t("classrooms")}</Label>
        <ClassroomSelector
          className="w-[300px]"
          defaultValue={searchParams.get("classroom") ?? ""}
          onSelect={(val) => {
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
