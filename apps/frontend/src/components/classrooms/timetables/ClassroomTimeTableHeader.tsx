"use client";

import { useParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, MoreVerticalIcon, PlusIcon, Trash2 } from "lucide-react";
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

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";

export function ClassroomTimeTableHeader() {
  const { t } = useLocale();
  const confirm = useConfirm();
  const params = useParams<{ id: string }>();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { openModal } = useModal();
  const canDeleteTimetable = useCheckPermission(
    "timetable",
    PermissionAction.DELETE,
  );
  const canCreateTimetable = useCheckPermission(
    "timetable",
    PermissionAction.CREATE,
  );
  const clearClassroomLessonMutation = useMutation(
    trpc.subjectTimetable.clearByClassroom.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.subjectTimetable.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  return (
    <div className="bg-secondary flex flex-row items-center gap-2 border-b px-4 py-1">
      <CalendarDays className="h-4 w-4" />
      <Label>{t("classroom_timetables")}</Label>
      <div className="ml-auto flex flex-row items-center gap-2">
        {canCreateTimetable && (
          <Button
            onClick={() => {
              openModal({
                title: t("add"),
                view: <></>,
              });
            }}
            variant={"default"}
            size={"sm"}
          >
            <PlusIcon />
            {t("add")}
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} className="size-8" size={"icon"}>
              <MoreVerticalIcon className="h-4 w-4" />
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
            {canDeleteTimetable && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async () => {
                    const isConfirmed = await confirm({
                      title: t("delete"),
                      description: t("delete_confirmation"),
                      // icon: <Trash2 className="h-5 w-5 text-destructive" />,
                      // alertDialogTitle: {
                      //   className: "flex items-center gap-1",
                      // },
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
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
