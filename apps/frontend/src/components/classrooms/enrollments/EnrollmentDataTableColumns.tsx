import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";
import { useParams } from "next/navigation";
import i18next from "i18next";
import { Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { useRouter } from "@repo/hooks/use-router";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { Checkbox } from "@repo/ui/checkbox";
import { useConfirm } from "@repo/ui/confirm-dialog";
import { DataTableColumnHeader } from "@repo/ui/data-table/v2/data-table-column-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import FlatBadge from "@repo/ui/FlatBadge";

import { AvatarState } from "~/components/AvatarState";
import { StudentCard } from "~/components/students/StudentCard";
import { routes } from "~/configs/routes";
import { getErrorMessage } from "~/lib/handle-error";
import { api } from "~/trpc/react";
import { getFullName } from "~/utils/full-name";

type ClassroomStudentProcedureOutput =
  RouterOutputs["classroom"]["students"][number];

export function fetchEnrollmentColumns({
  t,
}: {
  t: TFunction<string, unknown>;
}): ColumnDef<ClassroomStudentProcedureOutput>[] {
  const dateFormater = Intl.DateTimeFormat(i18next.language, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return [
    {
      id: "select",
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
      enableHiding: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("")} />
      ),
      enableSorting: false,
      cell: ({ row }) => {
        const student = row.original;
        return (
          <AvatarState
            pos={getFullName(student).length}
            avatar={student.avatar}
          />
        );
      },
    },
    {
      accessorKey: "registrationNumber",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("registrationNumber")}
        />
      ),
      cell: ({ row }) => {
        const student = row.original;
        return <div>{student.registrationNumber}</div>;
      },
    },
    {
      accessorKey: "lastName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("lastName")} />
      ),
      cell: ({ row }) => {
        const student = row.original;
        return <StudentCard name={student.lastName} />;
      },
    },
    {
      accessorKey: "firstName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("firstName")} />
      ),
      cell: ({ row }) => {
        const student = row.original;
        return <StudentCard name={student.firstName} />;
      },
    },
    {
      accessorKey: "dateOfBirth",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("dateOfBirth")} />
      ),
      cell: ({ row }) => {
        const student = row.original;
        return (
          <div>
            {student.dateOfBirth && dateFormater.format(student.dateOfBirth)}
          </div>
        );
      },
    },
    {
      id: "isRepeating",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("isRepeating")} />
      ),
      cell: ({ row }) => {
        const student = row.original;
        const v = student.isRepeating ? t("yes") : t("no");
        return (
          <FlatBadge variant={student.isRepeating ? "red" : "gray"}>
            {v}
          </FlatBadge>
        );
      },
    },
    {
      id: "gender",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("gender")} />
      ),
      cell: ({ row }) => {
        const student = row.original;
        return (
          <FlatBadge
            className="w-[70px] items-center justify-center"
            variant={student.gender == "female" ? "pink" : "green"}
          >
            {t(student.gender ?? "male")}
          </FlatBadge>
        );
      },
    },
    {
      id: "phone",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("phone")} />
      ),
      cell: ({ row }) => {
        return <div>{row.original.phoneNumber}</div>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const student = row.original;
        return ActionCell({ student });
      },
    },
  ];
}

function ActionCell({ student }: { student: ClassroomStudentProcedureOutput }) {
  const params = useParams<{ id: string }>();
  const { t } = useLocale();
  const router = useRouter();
  const unenrollStudentsMutation =
    api.enrollment.deleteByStudentIdClassroomId.useMutation({
      onSettled: () => api.useUtils().classroom.students.invalidate(params.id),
    });

  const confirm = useConfirm();
  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} size={"icon"}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="flex items-center gap-2"
            onSelect={() => {
              router.push(routes.students.details(student.id));
            }}
          >
            <Eye className="h-4 w-4" /> {t("details")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex items-center gap-2 bg-destructive text-destructive-foreground"
            onSelect={async () => {
              const isConfirmed = await confirm({
                title: t("unenroll") + " " + student.lastName,
                description: t("delete_confirmation"),
              });
              if (isConfirmed) {
                toast.promise(
                  unenrollStudentsMutation.mutateAsync({
                    classroomId: params.id,
                    studentId: student.id,
                  }),
                  {
                    loading: t("unenrolling"),
                    error: (error) => {
                      return getErrorMessage(error);
                    },
                    success: () => {
                      return t("unenrolled_sucessfully");
                    },
                  },
                );
              }
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" /> {t("unenroll")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
