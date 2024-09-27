"use client";

import { useParams } from "next/navigation";
import { CalendarDays, MoreVerticalIcon, PlusIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useLocale } from "@repo/hooks/use-locale";
import { useModal } from "@repo/hooks/use-modal";
import { Button } from "@repo/ui/button";
import { useConfirm } from "@repo/ui/confirm-dialog";
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
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { api } from "~/trpc/react";
import { CreateEditTimetable } from "./CreateEditTimetable";

export function ClassroomTimeTableHeader() {
  const { t } = useLocale();
  const confirm = useConfirm();
  const params = useParams<{ id: string }>();
  const utils = api.useUtils();
  const { openModal } = useModal();
  const clearClassroomTimeTableMutation =
    api.timetable.clearByClassroom.useMutation({
      onSettled: async () => {
        await utils.timetable.invalidate();
      },
      onSuccess: () => {
        toast.success(t("deleted_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    });
  return (
    <div className="flex flex-row items-center gap-2 border-b bg-secondary px-2 py-1">
      <CalendarDays className="h-4 w-4" />
      <Label>{t("classroom_timetables")}</Label>
      <div className="ml-auto flex flex-row items-center gap-2">
        <Button
          onClick={() => {
            openModal({
              title: t("create_timetable"),
              className: "w-[500px]",
              view: <CreateEditTimetable classroomId={params.id} />,
            });
          }}
          variant={"default"}
          size={"sm"}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          {t("add")}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} size={"icon"}>
              <MoreVerticalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownHelp />
            <DropdownMenuItem>
              <PDFIcon className="mr-2 h-4 w-4" />
              {t("pdf_export")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <XMLIcon className="mr-2 h-4 w-4" />
              {t("xml_export")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                const isConfirmed = await confirm({
                  title: t("delete"),
                  description: t("delete_confirmation"),
                  icon: <Trash2 className="h-5 w-5 text-destructive" />,
                  alertDialogTitle: {
                    className: "flex items-center gap-1",
                  },
                });
                if (isConfirmed) {
                  toast.loading(t("deleting"), { id: 0 });
                  clearClassroomTimeTableMutation.mutate({
                    classroomId: params.id,
                  });
                }
              }}
              className="text-destructive focus:bg-[#FF666618] focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t("clear_all")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
