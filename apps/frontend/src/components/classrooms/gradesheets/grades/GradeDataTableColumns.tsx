import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import Link from "next/link";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { decode } from "entities";
import { FlagOff, Pencil } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { DataTableColumnHeader } from "@repo/ui/datatable/data-table-column-header";

import { AvatarState } from "~/components/AvatarState";
import { routes } from "~/configs/routes";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";
import { getAppreciations } from "~/utils/appreciations";
import { EditStudentGrade } from "./EditStudentGrade";

type GradeSheetGetGradeProcedureOutput = NonNullable<
  RouterOutputs["gradeSheet"]["grades"]
>[number];

export function useGradeColumns(): ColumnDef<
  GradeSheetGetGradeProcedureOutput,
  unknown
>[] {
  const t = useTranslations();
  return useMemo(
    () => [
      {
        id: "select",
        accessorKey: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        size: 28,
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: "avatar",
        size: 40,
        cell: ({ row }) => {
          const student = row.original.student;
          return (
            <AvatarState
              avatar={student.user?.avatar}
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
        size: 60,
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
              {decode(student.lastName ?? "")}
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
              {decode(student.firstName ?? "")}
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
        size: 60,
      },
      {
        accessorKey: "isAbsent",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("absent")} />
        ),
        size: 60,
        cell: ({ row }) => {
          const grade = row.original;
          return (
            <Badge variant={grade.isAbsent ? "destructive" : "outline"}>
              {grade.isAbsent ? t("yes") : t("no")}
            </Badge>
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
          return (
            <div>{grade.isAbsent ? "" : getAppreciations(grade.grade)}</div>
          );
        },
      },
      {
        id: "actions",
        cell: ({ row }) => <ActionCells grade={row.original} />,
        size: 60,
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [t],
  );
}

function ActionCells({ grade }: { grade: GradeSheetGetGradeProcedureOutput }) {
  const confirm = useConfirm();

  const t = useTranslations();
  const { openModal } = useModal();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const isClosed = !grade.gradeSheet.term.isActive;

  const markGradeAbsent = useMutation(
    trpc.grade.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.classroom.gradesheets.pathFilter(),
        );
        await queryClient.invalidateQueries(
          trpc.gradeSheet.grades.pathFilter(),
        );
        toast.success(t("marked_absent_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const canUpdateGradesheet = useCheckPermission(
    "gradesheet",
    PermissionAction.UPDATE,
  );

  return (
    <div className="flex justify-end">
      {canUpdateGradesheet && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-label="Open menu"
              variant="ghost"
              className="data-[state=open]:bg-muted flex size-8 p-0"
            >
              <DotsHorizontalIcon className="size-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              disabled={isClosed}
              onSelect={() => {
                const st = grade.student;
                if (!st.id) {
                  return;
                }
                openModal({
                  title: t("edit"),
                  description: getFullName(st),

                  view: (
                    <EditStudentGrade
                      gradeId={grade.id}
                      grade={grade.grade}
                      studentId={st.id}
                    />
                  ),
                });
              }}
            >
              <Pencil />
              {t("edit")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              disabled={isClosed}
              variant="destructive"
              onSelect={async () => {
                const isConfirmed = await confirm({
                  title: t("delete"),
                  description: t("delete_confirmation"),
                });
                if (isConfirmed) {
                  toast.loading(t("deleting"), { id: 0 });
                  markGradeAbsent.mutate({
                    id: grade.id,
                    grade: 0,
                    isAbsent: true,
                  });
                }
              }}
            >
              <FlagOff className="size-4" />
              {t("mark_absent")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
