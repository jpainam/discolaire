import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { routes } from "~/configs/routes";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { DeleteIcon, ViewIcon } from "~/icons";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";

type ClassroomGradeSheetProcedureOutput = NonNullable<
  RouterOutputs["classroom"]["gradesheets"]
>[number];

export function ActionCells({
  gradesheet,
  classroomId,
}: {
  classroomId: string;
  gradesheet: ClassroomGradeSheetProcedureOutput;
}) {
  const confirm = useConfirm();

  const t = useTranslations();

  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const deleteGradeSheetMutation = useMutation(
    trpc.gradeSheet.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.classroom.gradesheets.pathFilter(),
        );
        toast.success(t("deleted_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const canDeleteGradesheet = useCheckPermission(
    "gradesheet",
    PermissionAction.DELETE,
  );
  const canUpdateGradesheet = useCheckPermission(
    "gradesheet",
    PermissionAction.UPDATE,
  );

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size={"icon-sm"} variant="ghost">
            <DotsHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={() => {
              router.push(
                routes.classrooms.gradesheets.details(
                  classroomId,
                  gradesheet.id,
                ),
              );
            }}
          >
            <ViewIcon />
            {t("details")}
          </DropdownMenuItem>
          {canUpdateGradesheet && (
            <DropdownMenuItem
              disabled={!gradesheet.isActive || !gradesheet.term.isActive}
              onSelect={() => {
                router.push(
                  routes.classrooms.gradesheets.edit(
                    classroomId,
                    gradesheet.id,
                  ),
                );
              }}
            >
              <Pencil />
              {t("edit")}
            </DropdownMenuItem>
          )}
          {canDeleteGradesheet && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={
                  deleteGradeSheetMutation.isPending ||
                  !gradesheet.isActive ||
                  !gradesheet.term.isActive
                }
                variant="destructive"
                onSelect={async () => {
                  const isConfirmed = await confirm({
                    title: t("delete"),
                    description: t("delete_confirmation"),
                    //icon: <Trash2 className="text-destructive" />,
                    // alertDialogTitle: {
                    //   className: "flex items-center gap-2",
                    // },
                  });
                  if (isConfirmed) {
                    toast.loading(t("deleting"), { id: 0 });
                    deleteGradeSheetMutation.mutate(gradesheet.id);
                  }
                }}
              >
                <DeleteIcon />
                {t("delete")}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
