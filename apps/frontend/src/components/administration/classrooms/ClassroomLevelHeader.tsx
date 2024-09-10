"use client";

import { useAtomValue } from "jotai";
import { MoreVertical, PlusIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useModal } from "@repo/hooks/use-modal";
import { useLocale } from "@repo/i18n";
import { PermissionAction } from "@repo/lib/permission";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { Label } from "@repo/ui/label";

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { useCheckPermissions } from "~/hooks/use-permissions";
import { api } from "~/trpc/react";
import { selectedClassroomLevelAtom } from "./_atom";
import { CreateEditLevel } from "./CreateEditLevel";

export function ClassroomLevelHeader() {
  const { t } = useLocale();
  const { openModal } = useModal();
  const selectedLevels = useAtomValue(selectedClassroomLevelAtom);
  const toastId = 0;
  const canAddLevel = useCheckPermissions(
    PermissionAction.CREATE,
    "classroom:level",
  );
  const utils = api.useUtils();
  const deleteClassroomLevelMutation = api.classroomLevel.delete.useMutation({
    onSettled: () => utils.classroomLevel.invalidate(),
    onError: (error) => {
      toast.error(error.message, { id: toastId });
    },
  });
  if (deleteClassroomLevelMutation.isPending) {
    toast.loading(t("deleting"), { id: toastId });
  }

  return (
    <div className="flex flex-row items-center gap-2">
      <Label>{t("Niveau des classes")}</Label>
      <div className="ml-auto flex flex-row items-center gap-2">
        {canAddLevel && (
          <Button
            onClick={() => {
              openModal({
                className: "w-96",
                title: t("level"),
                view: <CreateEditLevel />,
              });
            }}
            size={"sm"}
            variant={"default"}
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            {t("add")}
          </Button>
        )}
        {selectedLevels.length > 0 && (
          <Button variant={"destructive"}>
            <Trash2 className="mr-2 h-4 w-4" />
            <span className="mr-2">{t("delete")}</span>({selectedLevels.length})
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
            <DropdownMenuItem>
              <XMLIcon className="mr-2 h-4 w-4" />
              {t("print")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <PDFIcon className="mr-2 h-4 w-4" />
              {t("print")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
