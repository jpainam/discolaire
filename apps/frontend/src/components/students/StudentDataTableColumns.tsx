"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";
import Link from "next/link";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { decode } from "entities";
import i18next from "i18next";
import { Eye, Pencil, Trash2 } from "lucide-react";
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
import { useRouter } from "~/hooks/use-router";
import { useLocale } from "~/i18n";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { getAge, getFullName } from "~/utils";
import { DropdownInvitation } from "../shared/invitations/DropdownInvitation";
import { SimpleTooltip } from "../simple-tooltip";

type StudentAllProcedureOutput = RouterOutputs["student"]["all"][number];

interface UseStudentColumnsProps {
  t: TFunction<string, unknown>;
}

export function fetchStudentColumns({ t }: UseStudentColumnsProps): {
  columns: ColumnDef<StudentAllProcedureOutput, unknown>[];
} {
  const allcolumns = [
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
      size: 25,
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "avatar",
      accessorKey: "avatar",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("")} />
      ),
      cell: ({ row }) => {
        const student = row.original;
        return (
          <AvatarState
            avatar={student.user?.avatar}
            pos={getFullName(row.original).length}
          />
        );
      },
      enableSorting: false,
      enableHiding: false,
      size: 45,
    },
    {
      id: "lastName",
      accessorKey: "lastName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("lastName")} />
      ),
      cell: ({ row }) => {
        const student = row.original;
        return (
          <Link
            className="line-clamp-1 capitalize hover:text-blue-600 hover:underline"
            href={routes.students.details(student.id)}
          >
            {decode(student.lastName ?? "")}
          </Link>
        );
      },
    },
    {
      id: "firstName",
      accessorKey: "firstName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("firstName")} />
      ),
      cell: ({ row }) => {
        const student = row.original;

        return (
          <Link
            className="text-muted-foreground line-clamp-1 hover:text-blue-600 hover:underline"
            href={routes.students.details(student.id)}
          >
            <span className="capitalize">
              {decode(student.firstName ?? "")}
            </span>
          </Link>
        );
      },
    },
    {
      id: "gender",
      accessorKey: "gender",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("gender")} />
      ),
      cell: ({ row }) => {
        const student = row.original;
        const gender = student.gender;
        const sex = gender == "female" ? "F" : "M";
        return (
          // <FlatBadge
          //   variant={student.gender == "female" ? "pink" : "blue"}
          //   className="flex w-[85px] flex-row items-center gap-1"
          // >
          // <div className="flex flex-row items-center gap-2">
          //   {student.gender == "male" ? (
          //     <PiGenderMaleThin className="h-4 w-4" />
          //   ) : (
          //     <PiGenderFemaleThin className="h-4 w-4" />
          //   )}
          <span className="text-muted-foreground">{t(`${sex}`)}</span>
        );
      },
      size: 48,

      filterFn: (row, id, value) => {
        return value instanceof Array && value.includes(row.getValue(id));
      },
    },
    {
      id: "isRepeating",
      accessorKey: "isRepeating",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("isRepeating")} />
      ),
      size: 60,
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id));
      },
      cell: ({ row }) => {
        const student = row.original;
        const r = student.isRepeating ? t("yes") : t("no");
        return (
          <div className="flex items-center justify-center">
            {student.isRepeating ? (
              <Badge variant="destructive">{r}</Badge>
            ) : (
              <Badge variant="outline">{r}</Badge>
            )}
          </div>
        );
      },
    },
    {
      id: "classroom",
      accessorKey: "classroom",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("classroom")} />
      ),
      cell: ({ row }) => {
        const student = row.original;
        const classroom = student.classroom;
        if (!classroom) return <div></div>;
        return (
          <Link
            className="text-muted-foreground truncate hover:text-blue-600 hover:underline"
            href={routes.classrooms.details(classroom.id)}
          >
            {classroom.name}
          </Link>
        );
      },
    },
    // {
    //   id: "formerSchool",
    //   accessorKey: "formerSchool",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title={t("formerSchool")} />
    //   ),
    //   cell: ({ row }) => {
    //     const formerSchool = row.original?.formerSchool;
    //     return <div>{formerSchool?.name}</div>;
    //   },
    // },
    // {
    //   id: "email",
    //   accessorKey: "email",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title={t("email")} />
    //   ),
    //   cell: ({ row }) => {
    //     return <div>{row.getValue("email")}</div>;
    //   },
    //   enableSorting: true,
    // },
    // {
    //   id: "phoneNumber",
    //   accessorKey: "phoneNumber",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title={t("phone")} />
    //   ),
    //   cell: ({ row }) => {
    //     const student = row.original;
    //     return <div>{student.phoneNumber}</div>;
    //   },
    //   enableSorting: true,
    // },
    {
      id: "age",
      accessorKey: "dateOfBirth",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("age")} />
      ),
      cell: ({ row }) => {
        const dateOfBirth = row.original.dateOfBirth;
        const age = getAge(dateOfBirth);
        const date_of_birth = dateOfBirth?.toLocaleDateString(
          i18next.language,
          {
            timeZone: "UTC",
            year: "numeric",
            month: "short",
            day: "numeric",
          },
        );
        return (
          <SimpleTooltip
            content={date_of_birth ?? ""}
            className="text-muted-foreground"
          >
            <span> {age} ans</span>
          </SimpleTooltip>
        );
      },
    },
    // columnHelper.accessor("dateOfEntry", {
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title={t("dateOfEntry")} />
    //   ),
    //   cell: ({ row }) => {
    //     const d = dateFormatter.format(new Date(row.getValue("dateOfEntry")));
    //     return <div>{d}</div>;
    //   },
    // }),
    // {
    //   accessorKey: "dateOfExit",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title={t("dateOfExit")} />
    //   ),
    //   cell: ({ row }) => {
    //     const d = dateFormatter.format(new Date(row.getValue("dateOfExit")));
    //     return <div>{d}</div>;
    //   },
    // },
    {
      id: "residence",
      accessorKey: "residence",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("residence")} />
      ),
      cell: ({ row }) => {
        return (
          <div className="text-muted-foreground">{row.original.residence}</div>
        );
      },
    },
    // columnHelper.accessor("placeOfBirth", {
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title={t("placeOfBirth")} />
    //   ),
    //   cell: (info) => info.getValue(),
    //   enableSorting: true,
    // }),
    // {
    //   id: "country",
    //   accessorKey: "country",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title={t("country")} />
    //   ),
    //   cell: ({ row }) => {
    //     const countryId = row.original.country?.id as RPNInput.Country;
    //     const Flag = flags[countryId];
    //     return (
    //       <div className="flex flex-row items-center gap-1">
    //         <span className="flex h-4 w-6 overflow-hidden rounded-sm bg-foreground/20">
    //           {Flag && <Flag title={row.original.country?.name ?? ""} />}
    //         </span>
    //         <span className="text-muted-foreground text-sm">
    //           {row.original.country?.name}
    //         </span>
    //       </div>
    //     );
    //   },
    //   enableSorting: true,
    // },
    // {
    //   accessorKey: "observation",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title={t("observation")} />
    //   ),
    //   cell: (info) => info.getValue(),
    // },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => <ActionCells student={row.original} />,
      size: 60,
      enableSorting: false,
      enableHiding: false,
    },
  ] as ColumnDef<StudentAllProcedureOutput, unknown>[];

  //   const filteredColumns = columns //@ts-ignore
  //     .map((col) => allcolumns.find((c) => c.accessorKey === col))
  //     .filter(Boolean) as ColumnDef<Student, unknown>[];

  //   action && filteredColumns.push(action);
  const filteredColumns = allcolumns;
  return {
    columns: filteredColumns,
  };
}

function ActionCells({ student }: { student: StudentAllProcedureOutput }) {
  const { t } = useLocale();
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const confirm = useConfirm();

  const deleteStudentMutation = useMutation(
    trpc.student.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.student.all.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="Open menu"
            variant={"ghost"}
            className="data-[state=open]:bg-muted flex size-8 p-0"
          >
            <DotsHorizontalIcon aria-hidden="true" className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => {
              router.push(routes.students.details(student.id));
            }}
          >
            <Eye /> {t("details")}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => {
              router.push(routes.students.edit(student.id));
            }}
          >
            <Pencil />
            {t("edit")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownInvitation
            entityId={student.id}
            entityType="student"
            email={student.user?.email}
          />
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onSelect={async () => {
              const isConfirmed = await confirm({
                title: t("delete"),
                description: t("delete_confirmation", {
                  name: getFullName(student),
                }),
              });
              if (isConfirmed) {
                toast.loading(t("deleting"), { id: 0 });
                deleteStudentMutation.mutate(student.id);
              }
            }}
          >
            <Trash2 />
            {t("delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
