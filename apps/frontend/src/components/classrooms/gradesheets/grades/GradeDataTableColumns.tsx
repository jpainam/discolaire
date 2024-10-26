import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";
import Link from "next/link";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { FlagOff, Pencil } from "lucide-react";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { useModal } from "@repo/hooks/use-modal";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { Checkbox } from "@repo/ui/checkbox";
import { useConfirm } from "@repo/ui/confirm-dialog";
import { DataTableColumnHeader } from "@repo/ui/data-table/data-table-column-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import FlatBadge from "@repo/ui/FlatBadge";

import { AvatarState } from "~/components/AvatarState";
import { routes } from "~/configs/routes";
import { getErrorMessage } from "~/lib/handle-error";
import { api } from "~/trpc/react";
import { getAppreciations } from "~/utils/get-appreciation";
import { EditGradeStudent } from "./EditGradeStudent";

type GradeSheetGetGradeProcedureOutput = NonNullable<
  RouterOutputs["gradeSheet"]["grades"]
>[number];

export function fetchGradeColumns({
  t,
  classroomId,
}: {
  t: TFunction<string, unknown>;
  classroomId: string;
}): ColumnDef<GradeSheetGetGradeProcedureOutput, unknown>[] {
  return [
    {
      id: "select",
      accessorKey: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-0.5"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "avatar",
      cell: ({ row }) => {
        const student = row.original.student;
        return (
          <AvatarState
            avatar={student.avatar}
            pos={student.firstName?.length}
          />
        );
      },
    },
    {
      accessorKey: "student.registrationNumber",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("registrationNumber")}
        />
      ),
      cell: ({ row }) => {
        const student = row.original.student;
        return (
          <Link
            className="hover:text-blue-600 hover:underline"
            href={routes.students.details(student.id)}
          >
            {student.registrationNumber}
          </Link>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "student.lastName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("lastName")} />
      ),
      cell: ({ row }) => {
        const student = row.original.student;
        return (
          <Link
            className="hover:text-blue-600 hover:underline"
            href={routes.students.details(student.id)}
          >
            {student.lastName}
          </Link>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "student.firstName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("firstName")} />
      ),
      cell: ({ row }) => {
        const student = row.original.student;
        return (
          <Link
            className="hover:text-blue-600 hover:underline"
            href={routes.students.details(student.id)}
          >
            {student.firstName}
          </Link>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "grade",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("grade")} />
      ),
      cell: ({ row }) => {
        const grade = row.original;
        return <div>{grade.isAbsent ? "-" : grade.grade}</div>;
      },
    },
    {
      accessorKey: "isAbsent",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("absent")} />
      ),
      cell: ({ row }) => {
        const grade = row.original;
        return (
          <FlatBadge variant={grade.isAbsent ? "red" : "green"}>
            {grade.isAbsent ? t("yes") : t("no")}
          </FlatBadge>
        );
      },
    },
    {
      id: "appreciation",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("appreciation")} />
      ),
      cell: ({ row }) => {
        const grade = row.original;
        return <div>{grade.isAbsent ? "" : getAppreciations(grade.grade)}</div>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <ActionCells classroomId={classroomId} grade={row.original} />
      ),
    },
  ];
}

function ActionCells({
  grade,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  classroomId,
}: {
  classroomId: string;
  grade: GradeSheetGetGradeProcedureOutput;
}) {
  const confirm = useConfirm();
  const { t } = useLocale();
  const { openModal } = useModal();

  const markGradeAbsent = api.grade.update.useMutation();
  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="Open menu"
            variant="ghost"
            className="flex size-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="size-4" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem
            onSelect={() => {
              const st = grade.student;
              if (!st.id) {
                return;
              }
              openModal({
                title: t("edit"),
                description: t("edit_grade_description", {
                  name: `${st.lastName} ${st.firstName}`,
                }),
                className: "w-[400px]",
                view: (
                  <EditGradeStudent
                    gradeId={grade.id}
                    grade={grade.grade}
                    studentId={st.id}
                  />
                ),
              });
            }}
          >
            <Pencil className="mr-2 size-4" />
            {t("edit")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:bg-[#FF666618] focus:text-destructive"
            onSelect={async () => {
              const isConfirmed = await confirm({
                title: t("delete"),
                description: t("delete_confirmation"),
              });
              if (isConfirmed) {
                toast.promise(
                  markGradeAbsent.mutateAsync({
                    id: grade.id,
                    grade: 0,
                    isAbsent: true,
                  }),
                  {
                    loading: t("mark_absent") + "...",
                    success: () => {
                      return t("marked_absent_successfully");
                    },
                    error: (error) => {
                      return getErrorMessage(error);
                    },
                  },
                );
              }
            }}
          >
            <FlagOff className="mr-2 size-4" />
            {t("mark_absent")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
