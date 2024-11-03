"use client";

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

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { CreateEditAbsence } from "./absence/CreateEditAbsence";
import { CreateEditChatter } from "./chatter/CreateEditChatter";
import { CreateEditConsigne } from "./consigne/CreateEditConsigne";
import { CreateEditExclusion } from "./exclusion/CreateEditExclusion";
import { CreateEditLateness } from "./lateness/CreateEditLateness";

export function AttendanceHeader() {
  const { t } = useLocale();
  const { openModal } = useModal();

  return (
    <div className="flex flex-row items-center gap-4 border-y bg-muted/50 px-4 py-1">
      <Label className="hidden md:block">{t("attendance_records")}</Label>
      {/* <FlatBadge>Total justified records: 2 out of 5</FlatBadge> */}
      <div className="ml-auto flex flex-row items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
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
              onClick={() => {
                openModal({
                  title: `${t("add")} - ${t("absence")}`,
                  className: "w-[400px]",
                  view: <CreateEditAbsence />,
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
