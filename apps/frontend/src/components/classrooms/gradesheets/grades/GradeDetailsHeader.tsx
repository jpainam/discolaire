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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { useLocale } from "~/i18n";
import { useConfirm } from "~/providers/confirm-dialog";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { TermIsClosed } from "~/components/TermIsClosed";
import { routes } from "~/configs/routes";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { PermissionAction } from "~/permissions";
import { useTRPC } from "~/trpc/react";
import { getAppreciations } from "~/utils/get-appreciation";
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

  //const classroomQuery = api.classroom.get.useQuery(params.id);
  const { t, i18n } = useLocale();
  const maxGrade = Math.max(...grades.map((grade) => grade.grade));
  const minGrade = Math.min(...grades.map((grade) => grade.grade));
  const grades10 = grades.filter((grade) => grade.grade >= 10).length;
  const len = grades.filter((grade) => !grade.isAbsent).length || 1e9;

  const males10Rate =
    grades.filter(
      (grade) => grade.grade >= 10 && grade.student.gender == "male",
    ).length / len;

  const females10Rate =
    grades.filter(
      (grade) => grade.grade >= 10 && grade.student.gender == "female",
    ).length / len;

  const dateFormatter = Intl.DateTimeFormat(i18n.language, {
    day: "numeric",
    month: "short",
    year: "numeric",
    weekday: "short",
  });
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
    }),
  );

  const canDeleteGradesheet = useCheckPermission(
    "gradesheet",
    PermissionAction.DELETE,
  );

  return (
    <div className="flex flex-col gap-2 border-b">
      <div className="grid gap-4 px-4 py-2 text-sm md:grid-cols-3">
        <div className="flex flex-col gap-2 rounded-md border bg-muted p-2">
          {/* <span>
            {classroomQuery.isPending ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              classroomQuery.data?.name
            )}
          </span> */}
          <span>
            {gradesheet.subject.course.name}
            {" / "} {t("coeff")} :{gradesheet.subject.coefficient}
          </span>
          <span>{gradesheet.name}</span>

          <span> {gradesheet.subject.teacher?.lastName}</span>
        </div>
        <div className="flex flex-col gap-2 rounded-md border bg-muted p-2">
          <span>{dateFormatter.format(gradesheet.createdAt)}</span>

          <span>
            {t("scale")}: {gradesheet.scale}
          </span>
          <span>
            {t("term")} : {gradesheet.term.name}
          </span>
        </div>

        <div className="flex flex-col gap-2 rounded-md border bg-muted p-2">
          <span>
            {t("max_grade")} : {isFinite(maxGrade) ? maxGrade : "-"}
          </span>
          <span>
            {t("min_grade")} : {isFinite(minGrade) ? minGrade : "-"}
          </span>

          <span>
            {t("avg_grade")} : {average.toFixed(2)}
          </span>
        </div>
      </div>
      <div className="px-4 py-2">
        <div className="bg-background overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead
                  align="center"
                  className="border-r text-center"
                  rowSpan={2}
                >
                  {t("number_assessed")}
                </TableHead>
                <TableHead className=" text-center" rowSpan={2}>
                  {t("overall_class_average")}
                </TableHead>
                <TableHead
                  className="border-r border-l text-center"
                  rowSpan={2}
                >
                  {t("number_of_avg_ge_10")}
                </TableHead>
                <TableHead className=" text-center" colSpan={2}>
                  {t("success_rate")}
                </TableHead>
                <TableHead className="border-l text-center" rowSpan={2}>
                  {t("overall_success_rate")}
                </TableHead>
                <TableHead className="border-l text-center" rowSpan={2}>
                  {t("observation")}
                </TableHead>
              </TableRow>
              <TableRow>
                <TableHead className=" text-center">{t("males")}</TableHead>
                <TableHead className="text-center">{t("females")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-center">
              <TableRow>
                <TableCell className="border-r">{grades.length}</TableCell>
                <TableCell className="border-r">{average.toFixed(2)}</TableCell>
                <TableCell className="border-r">{grades10}</TableCell>
                <TableCell className="border-r">
                  {(males10Rate * 100).toFixed(2)}%
                </TableCell>
                <TableCell className="border-r">
                  {(females10Rate * 100).toFixed(2)} %
                </TableCell>
                <TableCell className="border-r">
                  {((grades10 * 100) / len).toFixed(2)}%
                </TableCell>
                <TableCell>{getAppreciations(average)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="flex items-center gap-4 border-t bg-muted/50 px-4 py-1">
        <ReportFalseGrade />
        <TermIsClosed className="py-1" isClosed={isClosed} />
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
