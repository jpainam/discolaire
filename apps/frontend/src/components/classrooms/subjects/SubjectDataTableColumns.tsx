import Link from "next/link";
import { Button } from "@repo/ui/button";
import { Checkbox } from "@repo/ui/checkbox";
import { DataTableColumnHeader } from "@repo/ui/data-table/data-table-column-header";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { inferProcedureOutput } from "@trpc/server";
import { TFunction } from "i18next";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { routes } from "~/configs/routes";
import { useAlert } from "~/hooks/use-alert";
import { useLocale } from "~/hooks/use-locale";
import { useSheet } from "~/hooks/use-sheet";
import { getErrorMessage } from "~/lib/handle-error";
import { AppRouter } from "~/server/api/root";
import { api } from "~/trpc/react";
import { getFullName } from "~/utils/full-name";
import { CreateEditSubject } from "./CreateEditSubject";

type SubjectGetQueryOutput = NonNullable<
  inferProcedureOutput<AppRouter["subject"]["get"]>
>;

const columnHelper = createColumnHelper<SubjectGetQueryOutput>();

export const fetchSubjectsColumns = ({
  t,
}: {
  t: TFunction<string, unknown>;
}) =>
  [
    columnHelper.accessor<"id", number>("id", {
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
          }}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
          }}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    }),

    columnHelper.accessor("course", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Course" />
      ),
      cell: ({ row }) => {
        const subject = row.original;
        const course = subject.course;
        return (
          <Link
            href={
              routes.classrooms.subjects(`${subject.classroomId}`) +
              `/${subject.id}`
            }
            className="flex flex-row items-center space-x-1"
          >
            <div
              className="flex h-4 w-4 rounded-full"
              style={{
                backgroundColor: course?.color ?? "lightgray",
              }}
            ></div>
            <div>
              {course?.shortName?.toUpperCase()} - {course?.name}
            </div>
          </Link>
        );
      },
    }),
    columnHelper.accessor("teacher", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("teacher")} />
      ),
      cell: ({ row }) => {
        const t = row.original.teacher;
        return <div>{getFullName(t)}</div>;
      },
    }),
    columnHelper.accessor("coefficient", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("coefficient")} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center">
            {row.getValue("coefficient")}
          </div>
        );
      },
    }),
    columnHelper.accessor("subjectGroup", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Group" />
      ),
      cell: (value) => {
        const g = value.row.original.subjectGroup;
        return g ? g.name : "";
      },
      filterFn: (row, id, value) => {
        return value instanceof Array && value.includes(row.getValue(id));
      },
    }),
    columnHelper.accessor<"order", number>("order", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("order")} />
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          {row.getValue("order")}
        </div>
      ),
    }),
    {
      id: "actions",
      cell: ({ row }) => <ActionsCell subject={row.original} />,
    },
  ] as ColumnDef<SubjectGetQueryOutput, unknown>[];

function ActionsCell({ subject }: { subject: SubjectGetQueryOutput }) {
  const { t } = useLocale();
  const queryClient = useQueryClient();
  const { openAlert, closeAlert } = useAlert();
  const { openSheet } = useSheet();
  const deleteSubjectQuery = api.subject.delete.useMutation();
  const utils = api.useUtils();

  return (
    <div className="flex items-center justify-end">
      <Button
        onClick={() => {
          openSheet({
            title: (
              <div className="px-2">
                {t("edit")} : {subject?.course?.name}
              </div>
            ),
            view: <CreateEditSubject subject={subject} />,
          });
        }}
        variant={"ghost"}
        size={"icon"}
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        disabled={deleteSubjectQuery.isPending}
        variant={"ghost"}
        onClick={() => {
          openAlert({
            title: t("delete"),
            description: t("delete_confirmation"),
            onConfirm: () => {
              toast.promise(deleteSubjectQuery.mutateAsync(subject.id), {
                loading: t("deleting"),
                error: (error) => {
                  return getErrorMessage(error);
                },
                success: () => {
                  utils.classroom.subjects.invalidate();
                  closeAlert();
                  return t("deleted_successfully");
                },
              });
            },
          });
        }}
        size={"icon"}
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
}
