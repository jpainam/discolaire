"use client";

import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";

import { Button } from "@repo/ui/components/button";
import { Label } from "@repo/ui/components/label";

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { ClassroomSelector } from "~/components/shared/selects/ClassroomSelector";
import { TermSelector } from "~/components/shared/selects/TermSelector";

export function GradeReportHeader() {
  const t = useTranslations();
  const [classroomId, setClassroomId] = useQueryState("classroomId");
  const [termId, setTermId] = useQueryState("termId");
  return (
    <div className="flex w-full flex-row gap-4">
      <div className="flex flex-row items-center gap-2">
        <Label>{t("classrooms")}</Label>
        <ClassroomSelector
          className="w-58"
          defaultValue={classroomId ?? ""}
          onSelect={setClassroomId}
        />
      </div>
      <div className="flex flex-row items-center gap-2">
        <Label>{t("terms")}</Label>
        <TermSelector
          className="w-58"
          defaultValue={termId ?? ""}
          onChange={setTermId}
        />
      </div>
      <div className="ml-auto flex flex-row items-center gap-2">
        <Button variant={"secondary"} size={"sm"}>
          <PDFIcon />
          <span>{t("pdf_export")}</span>
        </Button>
        <Button variant={"secondary"} size={"sm"}>
          <XMLIcon />
          <span>{t("xml_export")}</span>
        </Button>
      </div>
    </div>
  );
}
