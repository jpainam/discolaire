"use client";

import {
  BaselineIcon,
  ChevronDown,
  DiameterIcon,
  LineChart,
  MoreVertical,
  NewspaperIcon,
  ShapesIcon,
  ShieldAlertIcon,
  Trash2,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

import { PreventAbsence } from "~/components/attendances/PreventAbsence";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { useCheckPermission } from "~/hooks/use-permission";
import { PermissionAction } from "~/permissions";
import { CreateEditAbsence } from "./absence/CreateEditAbsence";
import { CreateEditChatter } from "./chatter/CreateEditChatter";
import { CreateEditConsigne } from "./consigne/CreateEditConsigne";
import { CreateEditExclusion } from "./exclusion/CreateEditExclusion";
import { CreateEditLateness } from "./lateness/CreateEditLateness";

export function StudentAttendanceHeader({
  studentId,
  classroomId,
}: {
  studentId: string;
  classroomId?: string;
}) {
  const { t } = useLocale();
  const { openModal } = useModal();
  const searchParams = useSearchParams();

  const canCreateAttendance = useCheckPermission(
    "attendance",
    PermissionAction.CREATE,
  );

  return (
    <div className="flex flex-row items-center gap-2 border-b bg-muted/50 px-4 py-1">
      <LineChart className="hidden md:block w-4 h-4" />
      <Label className="hidden md:block">{t("attendances")}</Label>
      {/* <Label className="hidden md:block">{t("attendances")}</Label> */}
      {/* <div className="w-[15px] hidden md:block"></div> */}
      {/* <FlatBadge>Total justified records: 2 out of 5</FlatBadge> */}

      <TermSelector
        defaultValue={searchParams.get("term")}
        className="md:w-[300px]"
        onChange={(val) => {
          console.log(val);
        }}
      />
      <div className="ml-auto flex flex-row items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size={"sm"} variant={"outline"}>
              {t("prevent")}
              <ChevronDown size={16} strokeWidth={2} aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onSelect={() => {
                openModal({
                  title: t("prevent_an_absence"),
                  view: <PreventAbsence studentId={studentId} />,
                });
              }}
            >
              {t("prevent_an_absence")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {canCreateAttendance && (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size={"sm"}>
                  {t("add")}
                  <ChevronDown size={16} strokeWidth={2} aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  disabled={!classroomId}
                  onClick={() => {
                    if (!classroomId) return;
                    openModal({
                      title: `${t("add")} - ${t("absence")}`,
                      view: <CreateEditAbsence classroomId={classroomId} />,
                    });
                  }}
                >
                  <BaselineIcon />
                  {t("absence")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    openModal({
                      title: `${t("add")} - ${t("lateness")}`,
                      view: <CreateEditLateness />,
                    });
                  }}
                >
                  <DiameterIcon />
                  {t("lateness")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    openModal({
                      title: `${t("add")} - ${t("chatter")}`,
                      view: <CreateEditChatter />,
                    });
                  }}
                >
                  <NewspaperIcon />
                  {t("chatter")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    openModal({
                      title: `${t("add")} - ${t("consigne")}`,

                      view: <CreateEditConsigne />,
                    });
                  }}
                >
                  <ShapesIcon />
                  {t("consigne")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    openModal({
                      title: `${t("add")} - ${t("exclusion")}`,
                      className: "w-[600px]",
                      view: <CreateEditExclusion />,
                    });
                  }}
                >
                  <ShieldAlertIcon />
                  {t("exclusion")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"outline"} className="size-8" size={"icon"}>
                  <MoreVertical className="h-4 w-4" />
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
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  className="dark:data-[variant=destructive]:focus:bg-destructive/10"
                >
                  <Trash2 />
                  {t("clear_all")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
    </div>
  );
}
