import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";
import type { ReactNode } from "react";
import type * as RPNInput from "react-phone-number-input";
import Link from "next/link";
import { createColumnHelper } from "@tanstack/react-table";
import { PiGenderFemaleThin, PiGenderMaleThin } from "react-icons/pi";
import flags from "react-phone-number-input/flags";

import { Checkbox } from "@repo/ui/checkbox";
import { DataTableColumnHeader } from "@repo/ui/data-table/v2/data-table-column-header";
import FlatBadge from "@repo/ui/FlatBadge";

import type { Student } from "~/types/student";
import { AvatarState } from "~/components/AvatarState";
import { routes } from "~/configs/routes";
import { getFullName } from "~/utils/full-name";

const columnHelper = createColumnHelper<Student>();

export type StudentTableAction = ColumnDef<Student, unknown>;

interface UseStudentColumnsProps {
  actionCell?: (student: Student) => ReactNode;
  columns: string[];
  t: TFunction<string, unknown>;
  dateFormatter: Intl.DateTimeFormat;
  schoolYearId?: string;
  action?: StudentTableAction;
}
export function fetchStudentColumns({
  columns,

  action,
  t,
  dateFormatter,
}: UseStudentColumnsProps): {
  columns: ColumnDef<Student, unknown>[];
} {
  const allcolumns = [
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
      accessorKey: "avatar",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("")} />
      ),
      cell: ({ row }) => {
        return (
          <AvatarState
            avatar={row.original.avatar}
            pos={getFullName(row.original).length}
          />
        );
      },
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
      id: "firstName",
      accessorKey: "firstName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("firstName")} />
      ),
      cell: ({ row }) => {
        const student = row.original;
        return (
          <Link
            className="hover:text-blue-600 hover:underline"
            href={routes.students.details(student.id)}
          >
            {student.firstName}
          </Link>
        );
      },
    },
    {
      id: "fullName",
      accessorKey: "",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("fullName")} />
      ),
      cell: ({ row }) => {
        const student = row.original;
        return (
          <Link
            className="hover:text-blue-600 hover:underline"
            href={routes.students.details(student.id)}
          >
            {getFullName(student)}
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
        return (
          <FlatBadge variant={student.gender == "female" ? "pink" : "blue"}>
            {student.gender == "male" ? (
              <PiGenderMaleThin className="h-4 w-4" />
            ) : (
              <PiGenderFemaleThin className="h-4 w-4" />
            )}
            {t(`${gender}`)}
          </FlatBadge>
        );
      },
      enableSorting: true,
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
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id));
      },
      cell: ({ row }) => {
        const student = row.original;
        const r = student.isRepeating ? t("yes") : t("no");
        return (
          <div className="flex items-center justify-center">
            {student.isRepeating ? (
              <FlatBadge variant="red">{r}</FlatBadge>
            ) : (
              <FlatBadge variant="green">{r}</FlatBadge>
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
        return <div>{student.classroom?.shortName}</div>;
        // const enr = row.original?.enrollments?.find(
        //   (e) => e.schoolYearId == schoolYearId
        // );
        // const classroom = enr?.classroom;
        // return <div>{classroom?.shortName}</div>;
      },
      enableSorting: true,
    },
    {
      id: "formerSchool",
      accessorKey: "formerSchool",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("formerSchool")} />
      ),
      cell: ({ row }) => {
        const formerSchool = row.original.formerSchool;
        return <div>{formerSchool?.name}</div>;
      },
    },
    {
      id: "email",
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("email")} />
      ),
      cell: ({ row }) => {
        return <div>{row.getValue("email")}</div>;
      },
      enableSorting: true,
    },
    {
      id: "phoneNumber",
      accessorKey: "phoneNumber",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("phone")} />
      ),
      cell: ({ row }) => {
        const student = row.original;
        return <div>{student.phoneNumber}</div>;
      },
      enableSorting: true,
    },
    {
      accessorKey: "dateOfBirth",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("dateOfBirth")} />
      ),
      cell: ({ row }) => {
        const d = dateFormatter.format(new Date(row.getValue("dateOfBirth")));
        return <div>{d}</div>;
      },
    },
    columnHelper.accessor("dateOfEntry", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("dateOfEntry")} />
      ),
      cell: ({ row }) => {
        const d = dateFormatter.format(new Date(row.getValue("dateOfEntry")));
        return <div>{d}</div>;
      },
    }),
    {
      accessorKey: "dateOfExit",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("dateOfExit")} />
      ),
      cell: ({ row }) => {
        const d = dateFormatter.format(new Date(row.getValue("dateOfExit")));
        return <div>{d}</div>;
      },
    },
    {
      accessorKey: "residence",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("residence")} />
      ),
      cell: (info) => info.getValue(),
      enableSorting: true,
    },
    columnHelper.accessor("placeOfBirth", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("placeOfBirth")} />
      ),
      cell: (info) => info.getValue(),
      enableSorting: true,
    }),
    {
      accessorKey: "country",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("country")} />
      ),
      cell: ({ row }) => {
        const countryId = row.original.country?.id as RPNInput.Country;
        const Flag = flags[countryId];
        return (
          <div className="flex flex-row items-center gap-1">
            <span className="flex h-4 w-6 overflow-hidden rounded-sm bg-foreground/20">
              {Flag && <Flag title={row.original.country?.name ?? ""} />}
            </span>
            <span className="flex">{row.original.country?.name}</span>
          </div>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "observation",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("observation")} />
      ),
      cell: (info) => info.getValue(),
    },
  ] as ColumnDef<Student, unknown>[];

  const filteredColumns = columns
    // @ts-expect-error TODO: fix this
    .map((col) => allcolumns.find((c) => c.accessorKey === col))
    .filter(Boolean) as ColumnDef<Student, unknown>[];

  if (action) filteredColumns.push(action);

  return {
    columns: filteredColumns,
  };
}
