import type { RouterOutputs } from "@repo/api";
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
import type { ColumnDef } from "@tanstack/react-table";

import type { TFunction } from "i18next";
import i18next from "i18next";
import { Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import FlatBadge from "~/components/FlatBadge";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";

import { Badge } from "@repo/ui/components/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { AvatarState } from "~/components/AvatarState";
import { routes } from "~/configs/routes";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { useTRPC } from "~/trpc/react";
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
    timeZone: "UTC",
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
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("name")} />
      ),
      accessorKey: "lastName",
      cell: ({ row }) => {
        const student = row.original;
        return (
          <div className="flex items-center gap-3">
            <AvatarState
              pos={getFullName(student).length}
              avatar={student.user?.avatar}
            />
            <Link
              href={`/students/${student.id}`}
              className="font-medium hover:underline"
            >
              {getFullName(student)}
            </Link>
          </div>
        );
      },
      size: 400,
      enableHiding: false,
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
        return (
          <div className="text-muted-foreground">
            {student.registrationNumber}
          </div>
        );
      },
      size: 110,
    },

    {
      accessorKey: "dateOfBirth",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("dateOfBirth")} />
      ),
      cell: ({ row }) => {
        const student = row.original;
        return (
          <div className="text-muted-foreground">
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
          <Badge variant={student.isRepeating ? "destructive" : "outline"}>
            {v}
          </Badge>
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
    // {
    //   id: "phone",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title={t("phone")} />
    //   ),
    //   cell: ({ row }) => {
    //     return (
    //       <div className="text-muted-foreground">
    //         {row.original.phoneNumber}
    //       </div>
    //     );
    //   },
    // },
    {
      id: "actions",
      cell: ({ row }) => {
        const student = row.original;
        return ActionCell({ student });
      },
      size: 60,
      enableSorting: false,
      enableHiding: false,
    },
  ];
}

function ActionCell({ student }: { student: ClassroomStudentProcedureOutput }) {
  const params = useParams<{ id: string }>();
  const { t } = useLocale();
  const router = useRouter();
  const canDeleteEnrollment = useCheckPermission(
    "enrollment",
    PermissionAction.DELETE
  );
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const unenrollStudentsMutation = useMutation(
    trpc.enrollment.deleteByStudentIdClassroomId.mutationOptions({
      onSuccess: async () => {
        toast.success(t("unenrolled_successfully"), { id: 0 });
        await queryClient.invalidateQueries(
          trpc.classroom.students.pathFilter()
        );
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    })
  );

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
          {canDeleteEnrollment && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={!canDeleteEnrollment}
                variant="destructive"
                className="dark:data-[variant=destructive]:focus:bg-destructive/10"
                onSelect={async () => {
                  const isConfirmed = await confirm({
                    title: t("unenroll") + " " + student.lastName,
                    description: t("delete_confirmation"),
                  });
                  if (isConfirmed) {
                    toast.loading(t("unenrolling"), { id: 0 });
                    unenrollStudentsMutation.mutate({
                      classroomId: params.id,
                      studentId: student.id,
                    });
                  }
                }}
              >
                <Trash2 /> {t("unenroll")}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
