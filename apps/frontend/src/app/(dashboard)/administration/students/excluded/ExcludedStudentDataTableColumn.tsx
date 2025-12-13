import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import type { RouterOutputs } from "@repo/api";

import { AvatarState } from "~/components/AvatarState";
import { DataTableColumnHeader } from "~/components/datatable/data-table-column-header";
import FlatBadge from "~/components/FlatBadge";
import { Checkbox } from "~/components/ui/checkbox";
import { getFullName } from "~/utils";

export function useStudentColumns(): ColumnDef<
  RouterOutputs["student"]["excluded"][number]
>[] {
  const t = useTranslations();
  return useMemo(
    () => [
      {
        id: "select",
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
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("name")} />
        ),
        accessorKey: "lastName",
        cell: ({ row }) => {
          const student = row.original;
          return (
            <div className="flex items-center gap-2">
              <AvatarState
                pos={getFullName(student).length}
                className="h-6 w-6"
                avatar={student.user?.avatar}
              />
              <Link
                href={`/students/${student.id}`}
                className="hover:underline"
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
              {student.dateOfBirth?.toLocaleDateString()}
            </div>
          );
        },
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
        accessorKey: "observation",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("observation")} />
        ),
        cell: ({ row }) => {
          const student = row.original;
          return (
            <div className="text-muted-foreground">{student.observation}</div>
          );
        },
      },
    ],
    [t],
  );
}
