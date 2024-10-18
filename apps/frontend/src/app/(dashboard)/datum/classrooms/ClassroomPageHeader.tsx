"use client";

import { MoreVertical, Plus } from "lucide-react";
import { toast } from "sonner";

import { useLocale } from "@repo/hooks/use-locale";
import { useSheet } from "@repo/hooks/use-sheet";
import { PermissionAction } from "@repo/lib/permission";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { Label } from "@repo/ui/label";

import { printClassroom } from "~/actions/reporting";
import { CreateEditClassroom } from "~/components/classrooms/CreateEditClassroom";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { useCheckPermissions } from "~/hooks/use-permissions";
import { getErrorMessage } from "~/lib/handle-error";
import { api } from "~/trpc/react";

export function ClassroomPageHeader() {
  const { t } = useLocale();
  const { openSheet } = useSheet();
  const utils = api.useUtils();

  const canCreateClassroom = useCheckPermissions(
    PermissionAction.CREATE,
    "classroom:details",
  );

  return (
    <div className="flex flex-row items-center gap-2 border-b px-2 pb-1">
      <Label>{t("classrooms")}</Label>

      <div className="ml-auto flex flex-row items-center gap-2">
        {canCreateClassroom && (
          <Button
            size={"sm"}
            disabled={!canCreateClassroom}
            onClick={() => {
              openSheet({
                className: "w-[700px]",
                title: t("create"),
                view: <CreateEditClassroom />,
              });
            }}
          >
            <Plus className="mr-2 size-4" aria-hidden="true" />
            {t("new")}
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} size={"icon"}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownHelp />
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => {
                toast.loading(t("printing"), { id: 0 });
                void printClassroom(t("classroom_list"), "excel")
                  .then(() => {
                    toast.success(t("printing_job_submitted"), { id: 0 });
                    void utils.reporting.invalidate();
                  })
                  .catch((e) => {
                    toast.error(getErrorMessage(e), { id: 0 });
                  });
              }}
            >
              <PDFIcon className="mr-2 h-4 w-4" />
              {t("pdf_export")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                toast.loading(t("printing"), { id: 0 });
                void printClassroom(t("classroom_list"), "excel")
                  .then(() => {
                    toast.success(t("printing_job_submitted"), { id: 0 });
                    void utils.reporting.invalidate();
                  })
                  .catch((e) => {
                    toast.error(getErrorMessage(e), { id: 0 });
                  });
              }}
            >
              <XMLIcon className="mr-2 h-4 w-4" />
              {t("xml_export")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
