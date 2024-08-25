"use client";

import { useParams } from "next/navigation";
import { DownloadIcon } from "@radix-ui/react-icons";
import { type Table } from "@tanstack/react-table";
import { inferProcedureOutput } from "@trpc/server";
import { Plus, Trash2, UploadIcon } from "lucide-react";
import { toast } from "sonner";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";

import { useAlert } from "~/hooks/use-alert";
import { useModal } from "~/hooks/use-modal";
import { exportTableToCSV } from "~/lib/export";
import { getErrorMessage } from "~/lib/handle-error";
import { AppRouter } from "~/server/api/root";
import { api } from "~/trpc/react";
import { EnrollStudent } from "./EnrollStudent";

type ClassroomStudentProcedureOutput = NonNullable<
  inferProcedureOutput<AppRouter["classroom"]["students"]>
>[number];

interface EnrollmentToolbarActionsProps {
  table: Table<ClassroomStudentProcedureOutput>;
}

export function EnrollmentDataTableActions({
  table,
}: EnrollmentToolbarActionsProps) {
  const { t } = useLocale();
  const { openModal } = useModal();
  const params = useParams<{ id: string }>();
  const { openAlert, closeAlert } = useAlert();
  const utils = api.useUtils();
  // const canEnrollStudent = useCheckPermissions(
  //   PermissionAction.CREATE,
  //   "classroom:enrollment"
  // );
  const unenrollStudentsMutation =
    api.enrollment.deleteByStudentIdClassroomId.useMutation();
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <Button
          disabled={false}
          onClick={() => {
            const selectedIds = table
              .getFilteredSelectedRowModel()
              .rows.map((row) => row.original.id);
            openAlert({
              title: t("unenroll"),
              description: t("delete_confirmation"),

              onConfirm: () => {
                toast.promise(
                  unenrollStudentsMutation.mutateAsync({
                    studentId: selectedIds,
                    classroomId: params.id as string,
                  }),
                  {
                    loading: t("unenrolling"),
                    error: (error) => {
                      return getErrorMessage(error);
                    },
                    success: async () => {
                      table.toggleAllRowsSelected(false);
                      await utils.classroom.students.invalidate(
                        params.id as string,
                      );
                      closeAlert();

                      return t("unenrolled_successfully");
                    },
                  },
                );
              },
            });
          }}
          size={"sm"}
          variant={"destructive"}
        >
          <Trash2 className="mr-2 size-4" aria-hidden="true" />
          {t("unenroll")} ({table.getFilteredSelectedRowModel().rows.length})
        </Button>
      ) : null}
      <Button
        variant="default"
        size="sm"
        disabled={false}
        onClick={() => {
          openModal({
            title: <div className="px-4 pt-4">{t("enroll_new_students")}</div>,
            className: "w-[600px] p-0",
            description: (
              <p className="px-4">{t("enroll_new_students_description")}</p>
            ),
            view: <EnrollStudent classroomId={params.id} />,
          });
        }}
      >
        <Plus className="mr-2 size-4" aria-hidden="true" />
        {t("enroll")}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          exportTableToCSV(table, {
            filename: "tasks",
            excludeColumns: ["select", "actions"],
          })
        }
      >
        <DownloadIcon className="mr-2 size-4" aria-hidden="true" />
        {t("export")}
      </Button>
      <Button variant={"outline"} size={"sm"}>
        <UploadIcon className="mr-2 size-4" aria-hidden="true" />
        {t("import")}
      </Button>
      {/**
       * Other actions can be added here.
       * For example, import, view, etc.
       */}
    </div>
  );
}
