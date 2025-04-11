"use client";

import { useAtom } from "jotai";
import { MoreVertical, PlusIcon, Trash2 } from "lucide-react";
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
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { useConfirm } from "~/providers/confirm-dialog";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { useTRPC } from "~/trpc/react";
import { selectedClassroomLevelAtom } from "./_atom";
import { CreateEditLevel } from "./CreateEditLevel";

export function ClassroomLevelHeader() {
  const { t } = useLocale();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { openModal } = useModal();
  const [selectedLevels, setSelectedLevels] = useAtom(
    selectedClassroomLevelAtom
  );

  const deleteClassroomLevelMutation = useMutation(
    trpc.classroomLevel.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.classroomLevel.all.pathFilter()
        );
        toast.success(t("deleted_successfully"), { id: 0 });
        setSelectedLevels([]);
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    })
  );

  const confirm = useConfirm();
  return (
    <div className="col-span-full flex flex-row items-center gap-2 border-b px-2 py-1">
      <Label>{t("Niveau des classes")}</Label>
      <div className="ml-auto flex flex-row items-center gap-2">
        <Button
          onClick={() => {
            openModal({
              title: t("level"),
              view: <CreateEditLevel />,
            });
          }}
          size={"sm"}
          variant={"default"}
        >
          <PlusIcon />
          {t("add")}
        </Button>

        {selectedLevels.length > 0 && (
          <Button
            onClick={async () => {
              const isConfirm = await confirm({
                title: t("delete"),
                description: t("delete_confirmation"),
                // icon: <Trash2 className="h-4 w-4 text-destructive" />,
                // alertDialogTitle: {
                //   className: "flex items-center gap-1",
                // },
              });
              if (isConfirm) {
                toast.loading(t("Processing..."), { id: 0 });
                deleteClassroomLevelMutation.mutate(selectedLevels);
              }
            }}
            variant={"destructive"}
            size={"sm"}
          >
            <Trash2 />
            <span>{t("delete")}</span>({selectedLevels.length})
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} className="size-8" size={"icon"}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownHelp />
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <PDFIcon />
              {t("pdf_export")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <XMLIcon />
              {t("xml_export")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
