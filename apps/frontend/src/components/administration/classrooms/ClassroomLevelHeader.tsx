"use client";

import { useAtom } from "jotai";
import { MoreVertical, PlusIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useModal } from "@repo/hooks/use-modal";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { useConfirm } from "@repo/ui/confirm-dialog";
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
import { api } from "~/trpc/react";
import { selectedClassroomLevelAtom } from "./_atom";
import { CreateEditLevel } from "./CreateEditLevel";

export function ClassroomLevelHeader() {
  const { t } = useLocale();
  const { openModal } = useModal();
  const [selectedLevels, setSelectedLevels] = useAtom(
    selectedClassroomLevelAtom,
  );

  // const canAddLevel = useCheckPermissions(
  //   PermissionAction.CREATE,
  //   "classroom:level",
  // );
  const utils = api.useUtils();
  const deleteClassroomLevelMutation = api.classroomLevel.delete.useMutation({
    onSettled: () => utils.classroomLevel.invalidate(),
    onSuccess: () => {
      toast.success(t("deleted_successfully"), { id: 0 });
      setSelectedLevels([]);
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });

  const confirm = useConfirm();
  return (
    <div className="flex flex-row items-center gap-2">
      <Label>{t("Niveau des classes")}</Label>
      <div className="ml-auto flex flex-row items-center gap-2">
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

        {selectedLevels.length > 0 && (
          <Button
            onClick={async () => {
              const isConfirm = await confirm({
                title: t("delete"),
                description: t("delete_confirmation"),
                icon: <Trash2 className="h-6 w-6" />,
                alertDialogTitle: {
                  className: "flex items-center gap-2",
                },
              });
              if (isConfirm) {
                toast.loading(t("deleting"), { id: 0 });
                deleteClassroomLevelMutation.mutate(selectedLevels);
              }
            }}
            variant={"destructive"}
          >
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
