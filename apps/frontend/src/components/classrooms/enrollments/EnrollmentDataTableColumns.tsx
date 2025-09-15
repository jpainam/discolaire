import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import i18next from "i18next";
import { Eye, MoreHorizontal, Trash2, Users2 } from "lucide-react";
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
import FlatBadge from "~/components/FlatBadge";
import { StudentContactListSheet } from "~/components/students/contacts/StudentContactListSheet";
import { routes } from "~/configs/routes";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { useSheet } from "~/hooks/use-sheet";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";

type ClassroomStudentProcedureOutput =
  RouterOutputs["classroom"]["students"][number];

export function fetchEnrollmentColumns({
  t,
  isActive,
}: {
  t: TFunction<string, unknown>;
  isActive: boolean;
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
          <div className="flex items-center gap-1.5">
            <AvatarState
              className="size-6"
              pos={getFullName(student).length}
              avatar={student.user?.avatar}
            />
            <Link href={`/students/${student.id}`} className="hover:underline">
              {getFullName(student)}
            </Link>
          </div>
        );
      },
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
      accessorKey: "placeOfBirth",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("placeOfBirth")} />
      ),
      cell: ({ row }) => {
        const student = row.original;
        return (
          <div className="text-muted-foreground">{student.placeOfBirth}</div>
        );
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
      size: 30,
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
        return ActionCell({ student, isActive });
      },
      size: 60,
      enableSorting: false,
      enableHiding: false,
    },
  ];
}

function ActionCell({
  student,
  isActive,
}: {
  student: ClassroomStudentProcedureOutput;
  isActive: boolean;
}) {
  const params = useParams<{ id: string }>();
  const { t } = useLocale();
  const router = useRouter();
  const canDeleteEnrollment = useCheckPermission(
    "enrollment",
    PermissionAction.DELETE,
  );
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const unenrollStudentsMutation = useMutation(
    trpc.enrollment.deleteByStudentIdClassroomId.mutationOptions({
      onSuccess: async () => {
        toast.success(t("success"), { id: 0 });
        await queryClient.invalidateQueries(
          trpc.classroom.students.pathFilter(),
        );
        await queryClient.invalidateQueries(trpc.classroom.get.pathFilter());
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const { openSheet } = useSheet();

  const confirm = useConfirm();
  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="size-7" variant={"ghost"} size={"icon"}>
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
            onSelect={() => {
              openSheet({
                title: t("parents"),
                view: <StudentContactListSheet studentId={student.id} />,
              });
            }}
          >
            <Users2 />
            {t("parents")}
          </DropdownMenuItem>
          {canDeleteEnrollment && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={!isActive}
                variant="destructive"
                onSelect={async () => {
                  const isConfirmed = await confirm({
                    title: t("unenroll") + " " + student.lastName,
                    description: t("delete_confirmation"),
                  });
                  if (isConfirmed) {
                    toast.loading(t("Processing"), { id: 0 });
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
