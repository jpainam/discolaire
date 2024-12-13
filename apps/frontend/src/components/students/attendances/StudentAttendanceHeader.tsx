"use client";

import { useSearchParams } from "next/navigation";
import {
  BaselineIcon,
  ChevronDown,
  DiameterIcon,
  MoreVertical,
  NewspaperIcon,
  ShapesIcon,
  ShieldAlertIcon,
  Trash2,
} from "lucide-react";

import { useModal } from "@repo/hooks/use-modal";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { Label } from "@repo/ui/label";

import { PreventAbsence } from "~/components/attendances/PreventAbsence";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { TermSelector } from "~/components/shared/selects/TermSelector";
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

  return (
    <div className="flex flex-row items-center gap-2 border-b bg-muted/50 px-4 py-1">
      <Label className="hidden md:block">{t("attendances")}</Label>
      {/* <FlatBadge>Total justified records: 2 out of 5</FlatBadge> */}
      <Label className="hidden md:block">{t("terms")}</Label>
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
              <ChevronDown
                className="-me-1 ms-2 opacity-60"
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onSelect={() => {
                openModal({
                  className: "w-[400px]",
                  title: t("prevent_an_absence"),
                  view: <PreventAbsence studentId={studentId} />,
                });
              }}
            >
              {t("prevent_an_absence")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size={"sm"}>
              {t("add")}
              <ChevronDown
                className="-me-1 ms-2 opacity-60"
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              disabled={!classroomId}
              onClick={() => {
                if (!classroomId) return;
                openModal({
                  title: `${t("add")} - ${t("absence")}`,
                  className: "w-[400px]",
                  view: <CreateEditAbsence classroomId={classroomId} />,
                });
              }}
            >
              <BaselineIcon className="mr-2 h-4 w-4" />
              {t("absence")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                openModal({
                  title: `${t("add")} - ${t("lateness")}`,
                  className: "w-[400px]",
                  view: <CreateEditLateness />,
                });
              }}
            >
              <DiameterIcon className="mr-2 h-4 w-4" />
              {t("lateness")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                openModal({
                  title: `${t("add")} - ${t("chatter")}`,
                  className: "w-[400px]",
                  view: <CreateEditChatter />,
                });
              }}
            >
              <NewspaperIcon className="mr-2 h-4 w-4" />
              {t("chatter")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                openModal({
                  title: `${t("add")} - ${t("consigne")}`,
                  className: "w-[400px]",
                  view: <CreateEditConsigne />,
                });
              }}
            >
              <ShapesIcon className="mr-2 h-4 w-4" />
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
              <ShieldAlertIcon className="mr-2 h-4 w-4" />
              {t("exclusion")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} size={"icon"}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <PDFIcon className="mr-2 h-4 w-4" />
              {t("pdf_export")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <XMLIcon className="mr-2 h-4 w-4" />
              {t("xml_export")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:bg-[#FF666618] focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              {t("clear_all")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
