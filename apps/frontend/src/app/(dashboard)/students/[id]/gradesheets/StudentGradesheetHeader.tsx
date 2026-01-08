"use client";

import { useParams } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Captions, MoreVertical } from "lucide-react";
import { useTranslations } from "next-intl";

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { CreateStudentGrade } from "~/components/students/grades/CreateStudentGrade";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Label } from "~/components/ui/label";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { PlusIcon } from "~/icons";
import { PermissionAction } from "~/permissions";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";

export function StudentGradesheetHeader() {
  const t = useTranslations();
  const params = useParams<{ id: string }>();
  const { openModal } = useModal();
  const trpc = useTRPC();
  const { data: student } = useSuspenseQuery(
    trpc.student.get.queryOptions(params.id),
  );

  const canUpdateGrade = useCheckPermission(
    "gradesheet",
    PermissionAction.UPDATE,
  );

  return (
    <div className="bg-muted/50 flex flex-row items-center gap-1 border-b px-4 py-1">
      <Captions className="h-4 w-4" />
      <Label>{t("transcripts")}</Label>
      <div className="ml-auto flex flex-row items-center gap-2">
        {canUpdateGrade && student.classroom && (
          <Button
            onClick={() => {
              if (!student.classroom) {
                return;
              }
              openModal({
                title: "Ajouter une note",
                className: "sm:max-w-xl",
                description: getFullName(student),
                view: (
                  <CreateStudentGrade
                    classroomId={student.classroom.id}
                    studentId={params.id}
                  />
                ),
              });
            }}
          >
            <PlusIcon />
            {t("add")}
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} size={"icon"}>
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownHelp />
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => {
                window.open(
                  `/api/pdfs/student/${params.id}/transcripts?format=pdf`,
                  "_blank",
                );
              }}
            >
              <PDFIcon />
              {t("pdf_export")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                window.open(
                  `/api/pdfs/student/${params.id}/transcripts?format=csv`,
                  "_blank",
                );
              }}
            >
              <XMLIcon />
              {t("xml_export")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
