"use client";

import { useParams } from "next/navigation";
import { ChevronDown, LineChart, MoreVertical, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";

import { CreateStudentAttendance } from "~/app/(dashboard)/students/[id]/attendances/CreateStudentAttendance";
import { PreventAbsence } from "~/components/attendances/PreventAbsence";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { TermSelector } from "~/components/shared/selects/TermSelector";
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
import { DeleteIcon } from "~/icons";

export function StudentAttendanceHeader() {
  const params = useParams<{ id: string }>();

  const t = useTranslations();
  const { openModal } = useModal();
  const [termId, setTermId] = useQueryState("termId");

  const canCreateAttendance = useCheckPermission("attendance.create");
  const canDeleteAttendance = useCheckPermission("attendance.delete");

  return (
    <div className="bg-muted/50 grid flex-row items-center gap-2 border-b px-4 py-1 md:flex">
      <div className="flex flex-row items-center gap-1">
        <LineChart className="h-4 w-4" />
        <Label>{t("attendances")}</Label>
      </div>

      <TermSelector
        defaultValue={termId}
        className="md:w-1/5"
        onChange={(val) => {
          void setTermId(val);
        }}
      />

      <div className="ml-auto flex flex-row items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"}>
              {t("prevent")}
              <ChevronDown size={16} strokeWidth={2} aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onSelect={() => {
                openModal({
                  title: t("prevent_an_absence"),
                  view: <PreventAbsence studentId={params.id} />,
                });
              }}
            >
              {t("prevent_an_absence")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {canCreateAttendance && (
          <Button
            onClick={() => {
              openModal({
                className: "sm:max-w-xl",
                title: "Saisie d'une présence",
                description: "Veuillez choisir la séquence",
                view: <CreateStudentAttendance />,
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
            <DropdownMenuItem>
              <PDFIcon />
              {t("pdf_export")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <XMLIcon />
              {t("xml_export")}
            </DropdownMenuItem>
            {canDeleteAttendance && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  <DeleteIcon />
                  {t("clear_all")}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
