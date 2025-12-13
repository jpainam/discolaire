"use client";

import { useTranslations } from "next-intl";
import { parseAsString, useQueryStates } from "nuqs";

import { ClassroomSelector } from "~/components/shared/selects/ClassroomSelector";
import { StaffSelector } from "~/components/shared/selects/StaffSelector";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { Label } from "~/components/ui/label";

export function CourseCoverageHeader() {
  const t = useTranslations();

  //const searchParams = useSearchParams();
  const [{ classroomId, teacherId, termId }, setSearchParams] = useQueryStates({
    classroomId: parseAsString,
    teacherId: parseAsString,
    termId: parseAsString,
  });
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="flex flex-col gap-1">
        <Label>{t("classrooms")}</Label>
        <ClassroomSelector
          defaultValue={classroomId ?? ""}
          onSelect={(val) => {
            void setSearchParams({
              classroomId: val,
            });
          }}
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label>{t("teachers")}</Label>
        <StaffSelector
          defaultValue={teacherId ?? ""}
          onSelect={(val) => {
            void setSearchParams({
              teacherId: val,
            });
          }}
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label>{t("terms")}</Label>
        <TermSelector
          defaultValue={termId}
          onChange={(val) => {
            void setSearchParams({ termId: val });
          }}
        />
      </div>
    </div>
  );
}
