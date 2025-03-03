"use client";

import { CalendarDays, MoreVerticalIcon, PlusIcon, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
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

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { api } from "~/trpc/react";
import { CreateEditLesson } from "./CreateEditLesson";

export function ClassroomTimeTableHeader() {
  const { t } = useLocale();
  const confirm = useConfirm();
  const params = useParams<{ id: string }>();
  const utils = api.useUtils();
  const { openModal } = useModal();
  const clearClassroomLessonMutation = api.lesson.clearByClassroom.useMutation({
    onSettled: async () => {
      await utils.lesson.invalidate();
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
              className: "w-[550px]",
              view: <CreateEditLesson />,
            });
          }}
          variant={"default"}
          size={"sm"}
        >
          <PlusIcon />
          {t("add")}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} size={"icon"}>
              <MoreVerticalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownHelp />
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
                  clearClassroomLessonMutation.mutate({
                    classroomId: params.id,
                  });
                }
              }}
              variant="destructive"
              className="dark:data-[variant=destructive]:focus:bg-destructive/10"
            >
              <Trash2 />
              {t("clear_all")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
