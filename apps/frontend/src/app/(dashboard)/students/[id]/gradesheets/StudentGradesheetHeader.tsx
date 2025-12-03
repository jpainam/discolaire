"use client";

import { useParams } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Captions, MoreVertical } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { CreateStudentGrade } from "~/components/students/grades/CreateStudentGrade";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
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
    <div className="text-muted-foreground bg-muted flex flex-row items-center gap-1 border-b px-4 py-1">
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
                description: `Note à une saisie existente ${getFullName(student)}`,
                view: (
                  <CreateStudentGrade
                    classroomId={student.classroom.id}
                    studentId={params.id}
                  />
                ),
              });
            }}
            size={"sm"}
          >
            Ajouter une note
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} size={"icon"} className="size-8">
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
