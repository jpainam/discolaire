import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";
import Link from "next/link";
import { createColumnHelper } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { useSheet } from "@repo/hooks/use-sheet";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { Checkbox } from "@repo/ui/checkbox";
import { useConfirm } from "@repo/ui/confirm-dialog";
import { DataTableColumnHeader } from "@repo/ui/data-table/data-table-column-header";

import { routes } from "~/configs/routes";
import { getErrorMessage } from "~/lib/handle-error";
import { api } from "~/trpc/react";
import { getFullName } from "~/utils/full-name";
import { CreateEditSubject } from "./CreateEditSubject";

type SubjectGetQueryOutput = NonNullable<RouterOutputs["subject"]["get"]>;

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
  const confirm = useConfirm();
  const { openSheet } = useSheet();
  const utils = api.useUtils();
  const deleteSubjectQuery = api.subject.delete.useMutation({
    onSettled: () => utils.classroom.subjects.invalidate(),
  });

  return (
    <div className="flex items-center justify-end">
      <Button
        onClick={() => {
          openSheet({
            title: (
              <div className="px-2">
                {t("edit")} : {subject.course?.name}
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
        onClick={async () => {
          const isConfirmed = await confirm({
            title: t("delete"),
            confirmText: t("delete_confirmation"),
          });
          if (isConfirmed) {
            toast.promise(deleteSubjectQuery.mutateAsync(subject.id), {
              loading: t("deleting"),
              error: (error) => {
                return getErrorMessage(error);
              },
              success: () => {
                return t("deleted_successfully");
              },
            });
          }
        }}
        size={"icon"}
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
}
