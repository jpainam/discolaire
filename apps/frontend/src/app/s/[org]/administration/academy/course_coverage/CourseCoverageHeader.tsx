"use client";

import { useTranslations } from "next-intl";

import { Label } from "@repo/ui/components/label";

import { ClassroomSelector } from "~/components/shared/selects/ClassroomSelector";
import { SubjectProgramCategorySelector } from "~/components/shared/selects/SubjectProgramCategorySelector";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useRouter } from "~/hooks/use-router";

export function CourseCoverageHeader() {
  const router = useRouter();
  const t = useTranslations();
  const { createQueryString } = useCreateQueryString();
  return (
    <div className="flex flex-row items-center gap-2">
      <Label>{t("classrooms")}</Label>
      <ClassroomSelector
        className="w-96"
        onChange={(val) => {
          router.push(`?` + createQueryString({ classroomId: val }));
        }}
      />
      <Label>{t("categories")}</Label>
      <SubjectProgramCategorySelector
        onChangeAction={(val) => {
          router.push(`?` + createQueryString({ categoryId: val }));
        }}
      />
    </div>
  );
}
