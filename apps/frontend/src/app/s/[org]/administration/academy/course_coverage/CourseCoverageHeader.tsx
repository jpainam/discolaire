"use client";

import { useTranslations } from "next-intl";

import { Label } from "@repo/ui/components/label";

import { ClassroomSelector } from "~/components/shared/selects/ClassroomSelector";
import { StaffSelector } from "~/components/shared/selects/StaffSelector";
import { SubjectProgramCategorySelector } from "~/components/shared/selects/SubjectProgramCategorySelector";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useRouter } from "~/hooks/use-router";

export function CourseCoverageHeader() {
  const router = useRouter();
  const t = useTranslations();
  const { createQueryString } = useCreateQueryString();
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="flex flex-col gap-1">
        <Label>{t("classrooms")}</Label>
        <ClassroomSelector
          onChange={(val) => {
            router.push(`?` + createQueryString({ classroomId: val }));
          }}
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label>{t("teachers")}</Label>
        <StaffSelector
          onChange={(val) => {
            router.push(`?` + createQueryString({ staffId: val }));
          }}
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label>{t("categories")}</Label>
        <SubjectProgramCategorySelector
          onChangeAction={(val) => {
            router.push(`?` + createQueryString({ categoryId: val }));
          }}
        />
      </div>
    </div>
  );
}
