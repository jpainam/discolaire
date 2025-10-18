"use client";

import { useParams } from "next/navigation";
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
import { useQueryState } from "nuqs";
import { toast } from "sonner";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";

import { PreventAbsence } from "~/components/attendances/PreventAbsence";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";
import { CreateEditChatter } from "./chatter/CreateEditChatter";
import { CreateEditConsigne } from "./consigne/CreateEditConsigne";
import { CreateEditExclusion } from "./exclusion/CreateEditExclusion";
import { CreateEditLateness } from "./lateness/CreateEditLateness";

export function StudentAttendanceHeader() {
  const params = useParams<{ id: string }>();
  const { t } = useLocale();
  const { openModal } = useModal();
  const [termId, setTermId] = useQueryState("termId");
  const [attendanceType, setAttendanceType] = useQueryState("attendanceType");

  const canCreateAttendance = useCheckPermission(
    "attendance",
    PermissionAction.CREATE,
  );

  return (
    <div className="bg-muted/50 grid flex-row items-center gap-2 border-b px-4 py-1 md:flex">
      <div className="flex flex-row items-center gap-1">
        <LineChart className="h-4 w-4" />
        <Label>{t("attendances")}</Label>
      </div>
      {/* <Label className="hidden md:block">{t("attendances")}</Label> */}
      {/* <div className="w-[15px] hidden md:block"></div> */}
      {/* <FlatBadge>Total justified records: 2 out of 5</FlatBadge> */}

      <TermSelector
        defaultValue={termId}
        className="md:w-1/5"
        onChange={(val) => {
          void setTermId(val);
        }}
      />
      <Label>{t("attendance_type")}</Label>
      <Select
        defaultValue={attendanceType ?? "all"}
        onValueChange={(val) => {
          void setAttendanceType(val == "all" ? null : val);
        }}
      >
        <SelectTrigger className="w-1/5">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("attendance_type")}</SelectItem>
          <SelectItem value="absence">{t("absence")}</SelectItem>
          <SelectItem value="chatter">{t("chatter")}</SelectItem>
          <SelectItem value="consigne">{t("consigne")}</SelectItem>
          <SelectItem value="exclusion">{t("exclusion")}</SelectItem>
          <SelectItem value="lateness">{t("lateness")}</SelectItem>
        </SelectContent>
      </Select>
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
                  view: <PreventAbsence studentId={params.id} />,
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
                  disabled={!termId}
                  onSelect={() => {
                    if (!termId) {
                      toast.warning("Veuillez sélectionner une période.");
                      return;
                    }
                    // openModal({
                    //   title: t("absence"),
                    //   view: <CreateEditAbsence termId={termId} />,
                    // });
                  }}
                >
                  <BaselineIcon />
                  {t("absence")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={!termId}
                  onSelect={() => {
                    if (!termId) {
                      toast.warning("Veuillez sélectionner une période.");
                      return;
                    }
                    openModal({
                      title: t("lateness"),
                      view: <CreateEditLateness termId={termId} />,
                    });
                  }}
                >
                  <DiameterIcon />
                  {t("lateness")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={!termId}
                  onSelect={() => {
                    if (!termId) {
                      toast.warning("Veuillez sélectionner une période.");
                      return;
                    }
                    openModal({
                      title: t("chatter"),
                      view: <CreateEditChatter termId={termId} />,
                    });
                  }}
                >
                  <NewspaperIcon />
                  {t("chatter")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={!termId}
                  onSelect={() => {
                    if (!termId) {
                      toast.warning("Veuillez sélectionner une période.");
                      return;
                    }
                    openModal({
                      title: t("consigne"),
                      view: <CreateEditConsigne termId={termId} />,
                    });
                  }}
                >
                  <ShapesIcon />
                  {t("consigne")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={!termId}
                  onSelect={() => {
                    if (!termId) {
                      toast.warning("Veuillez sélectionner une période.");
                      return;
                    }
                    openModal({
                      title: t("exclusion"),

                      view: <CreateEditExclusion termId={termId} />,
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
