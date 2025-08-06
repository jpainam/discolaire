"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useQueryStates } from "nuqs";

import { Checkbox } from "@repo/ui/components/checkbox";
import { Label } from "@repo/ui/components/label";

import { SubjectSelector } from "~/components/shared/selects/SubjectSelector";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useRouter } from "~/hooks/use-router";
import { createGradeSheetSearchSchema } from "./search-params";

export function ClassroomCreateGradeSheetHeader() {
  const params = useParams<{ id: string }>();
  const [searchParams] = useQueryStates(createGradeSheetSearchSchema);
  const { createQueryString } = useCreateQueryString();
  const router = useRouter();
  const t = useTranslations();

  return (
    <div className="bg-muted/50 grid flex-row gap-6 border-b px-4 py-1 text-sm md:flex">
      <div className="flex flex-row items-center gap-2">
        <Label>{t("term")} </Label>
        <TermSelector
          className="w-64"
          defaultValue={searchParams.termId?.toString()}
          onChange={(val) => {
            router.push("?" + createQueryString({ termId: val }));
          }}
        />
      </div>
      <div className="flex flex-row items-center gap-2">
        <Label>{t("subject")}</Label>
        <SubjectSelector
          className="w-96"
          defaultValue={searchParams.subjectId?.toString()}
          onChange={(val) => {
            router.push("?" + createQueryString({ subjectId: val }));
          }}
          classroomId={params.id}
        />
      </div>

      <div className="flex flex-row items-center gap-2">
        <Checkbox
          defaultChecked={searchParams.notifyParents}
          onCheckedChange={(checked) => {
            router.push(
              "?" + createQueryString({ notifyParents: checked ? "true" : "" }),
            );
          }}
        />
        <Label>{t("notify_parents")}</Label>
      </div>
      <div className="flex flex-row items-center gap-2">
        <Checkbox
          defaultChecked={searchParams.notifyStudents}
          onCheckedChange={(checked) => {
            router.push(
              "?" +
                createQueryString({
                  notifyStudents: checked ? "true" : "",
                }),
            );
          }}
        />

        <Label>{t("notify_students")}</Label>
      </div>
    </div>
  );
}
