"use client";

import { MoreVertical, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
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
import { useLocale } from "~/i18n";
import { useConfirm } from "~/providers/confirm-dialog";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { routes } from "~/configs/routes";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { PermissionAction } from "~/permissions";
import { useTRPC } from "~/trpc/react";
import { ReportFalseGrade } from "./ReportFalseGrade";

type GradeSheetGetGradeProcedureOutput = NonNullable<
  RouterOutputs["gradeSheet"]["grades"]
>[number];

type GradeSheetGetProcedureOutput = NonNullable<
  RouterOutputs["gradeSheet"]["get"]
>;

export function GradeDetailsHeader({
  grades,
  gradesheet,
}: {
  grades: GradeSheetGetGradeProcedureOutput[];
  gradesheet: GradeSheetGetProcedureOutput;
}) {
  const params = useParams<{ id: string }>();

  const { t, i18n } = useLocale();

  const grades10 = grades.filter((grade) => grade.grade >= 10).length;
  const len = grades.filter((grade) => !grade.isAbsent).length || 1e9;

  const males10Rate =
    grades.filter(
      (grade) => grade.grade >= 10 && grade.student.gender == "male"
    ).length / len;

  const females10Rate =
    grades.filter(
      (grade) => grade.grade >= 10 && grade.student.gender == "female"
    ).length / len;

  const average = grades.reduce((acc, grade) => acc + grade.grade, 0) / len;

  const confirm = useConfirm();
  const router = useRouter();
  const isClosed = gradesheet.term.endDate
    ? gradesheet.term.endDate < new Date()
    : false;

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
    })
  );

  const canDeleteGradesheet = useCheckPermission(
    "gradesheet",
    PermissionAction.DELETE
  );

  return (
    <div className="flex flex-col gap-2 border-b">
      <div className="flex items-center gap-4 border-t bg-muted/50 px-4 py-1">
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
                    "_blank"
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
                    "_blank"
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
                        icon: <Trash2 className="size-6 text-destructive" />,
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
