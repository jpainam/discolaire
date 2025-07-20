"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreVertical, Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { routes } from "~/configs/routes";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { ReportFalseGrade } from "./ReportFalseGrade";

type GradeSheetGetProcedureOutput = NonNullable<
  RouterOutputs["gradeSheet"]["get"]
>;

export function GradeDetailsHeader({
  gradesheet,
}: {
  gradesheet: GradeSheetGetProcedureOutput;
}) {
  const params = useParams<{ id: string }>();

  const { t } = useLocale();

  const confirm = useConfirm();
  const router = useRouter();
  const isClosed = gradesheet.term.endDate < new Date();

  useEffect(() => {
    if (isClosed) {
      toast.warning(t("this_term_is_closed"), { id: 0 });
    }
  }, [isClosed, t]);

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const deleteGradeSheetMutation = useMutation(
    trpc.gradeSheet.delete.mutationOptions({
      onSettled: async () => {
        await queryClient.invalidateQueries(trpc.gradeSheet.pathFilter());
        await queryClient.invalidateQueries(trpc.grade.pathFilter());
      },
      onSuccess: () => {
        toast.success(t("deleted_successfully"), { id: 0 });
        router.push(routes.classrooms.gradesheets.index(params.id));
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

  return (
    <div className="flex flex-col gap-2 border-b">
      <div className="bg-muted/50 flex items-center gap-4 border-t px-4 py-1">
        <ReportFalseGrade />
        {/* <TermIsClosed className="py-1" isClosed={isClosed} /> */}
        <div className="ml-auto flex flex-row items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"} size={"icon"}>
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* {canUpdateGradesheet && (
                <DropdownMenuItem>
                  <Pencil />
                  {t("edit")}
                </DropdownMenuItem>
              )} */}
              <DropdownHelp />
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => {
                  window.open(
                    `/api/pdfs/gradesheets/${gradesheet.id}?format=pdf&classroomId=${params.id}`,
                    "_blank",
                  );
                }}
              >
                <PDFIcon />
                {t("pdf_export")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  window.open(
                    `/api/pdfs/gradesheets/${gradesheet.id}?format=csv&classroomId=${params.id}`,
                    "_blank",
                  );
                }}
              >
                <XMLIcon />
                {t("xml_export")}
              </DropdownMenuItem>
              {canDeleteGradesheet && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    disabled={deleteGradeSheetMutation.isPending || isClosed}
                    onSelect={async () => {
                      const isConfirmed = await confirm({
                        title: t("delete"),
                        description: t("delete_confirmation"),
                        icon: <Trash2 className="text-destructive size-6" />,
                        alertDialogTitle: {
                          className: "flex items-center gap-2",
                        },
                      });
                      if (isConfirmed) {
                        toast.loading(t("deleting"), { id: 0 });
                        deleteGradeSheetMutation.mutate(gradesheet.id);
                      }
                    }}
                    variant="destructive"
                    className="dark:data-[variant=destructive]:focus:bg-destructive/10"
                  >
                    <Trash2 />
                    {t("delete")}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
