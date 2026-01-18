"use client";

import { useParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, MoreVerticalIcon, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Label } from "~/components/ui/label";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { DeleteIcon } from "~/icons";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";

export function ClassroomTimeTableHeader() {
  const t = useTranslations();
  const confirm = useConfirm();
  const params = useParams<{ id: string }>();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { openModal } = useModal();
  const canDeleteTimetable = useCheckPermission("timetable", "delete");
  const canCreateTimetable = useCheckPermission("timetable", "create");
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
    <div className="bg-secondary flex flex-row items-center gap-2 border-y px-4 py-1">
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
            <Button variant={"outline"} size={"icon"}>
              <MoreVerticalIcon />
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
                >
                  <DeleteIcon />
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
