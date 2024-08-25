import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar";
import { Checkbox } from "@repo/ui/checkbox";
import { DataTableColumnHeader } from "@repo/ui/data-table/data-table-column-header";
import { ColumnDef, createColumnHelper, Row } from "@tanstack/react-table";
import { TFunction } from "i18next";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

import { DeletePopover } from "~/components/shared/buttons/delete-popover";
import { EditButton } from "~/components/shared/buttons/edit-button";
import { ViewButton } from "~/components/shared/buttons/view-button";
import { routes } from "~/configs/routes";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useLocale } from "~/hooks/use-locale";
import { DataTableFilterableColumn } from "~/types/data-table";
import { Student } from "~/types/student";

const columnHelper = createColumnHelper<Student>();

export function fetchStudentColumns({
  t,
  dateFormatter,
  schoolYearId,
}: {
  t: TFunction<string, unknown>;
  dateFormatter: Intl.DateTimeFormat;
  schoolYearId?: string;
}): ColumnDef<Student, unknown>[] {
  return [
    columnHelper.accessor("id", {
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    }),
    columnHelper.accessor("avatar", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("")} />
      ),
      cell: ({ row }) => {
        return (
          <Avatar className="my-1 h-9 w-9">
            <AvatarImage
              src={row.original.avatar ?? ""}
              alt={row.original.firstName || ""}
            />
            <AvatarFallback>IN</AvatarFallback>
          </Avatar>
        );
      },
    }),
    columnHelper.accessor("lastName", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("lastName")} />
      ),
      cell: (info) => info.getValue(),
      enableSorting: true,
    }),
    columnHelper.accessor("firstName", {
      header: ({ column }) => (
        <DataTableColumnHeader
          className="flex w-24"
          column={column}
          title={t("firstName")}
        />
      ),
      cell: ({ row }) => {
        return <div>{row.getValue("firstName")}</div>;
      },
    }),

    columnHelper.accessor("gender", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("gender")} />
      ),
      cell: ({ row }) => {
        return <div>{t(row.getValue("gender") as string)}</div>;
      },
      enableSorting: true,
      filterFn: (row, id, value) => {
        return value instanceof Array && value.includes(row.getValue(id));
      },
    }),
    {
      id: "isRepeating",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("isRepeating")} />
      ),
      filterFn: (row, id, value) => {
        return value instanceof Array && value.includes(row.getValue(id));
      },
      cell: ({ row }) => {
        return <div>xxx</div>;
        // const enr = row.original?.enrollments?.find(
        //   (e) => e.schoolYearId == schoolYearId
        // );
        // const r = enr?.isRepeating ? t("yes") : t("no");
        // return (
        //   <FlatBadge variant={enr?.isRepeating ? "red" : "green"}>
        //     {r}
        //   </FlatBadge>
        // );
      },
    },
    columnHelper.accessor("classroom", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("classroom")} />
      ),
      cell: ({ row }) => {
        return <div>xxx</div>;
        // const enr = row.original?.enrollments?.find(
        //   (e) => e.schoolYearId == schoolYearId
        // );
        // const classroom = enr?.classroom;
        // return <div>{classroom?.shortName}</div>;
      },
      enableSorting: true,
    }),
    columnHelper.accessor("formerSchool", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("formerSchool")} />
      ),
      cell: ({ row }) => {
        const formerSchool = row.original?.formerSchool;
        return <div>{formerSchool?.name}</div>;
      },
    }),
    columnHelper.accessor("email", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("email")} />
      ),
      cell: ({ row }) => {
        return <div>{row.getValue("email")}</div>;
      },
      enableSorting: true,
    }),
    columnHelper.accessor("dateOfBirth", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("dateOfBirth")} />
      ),
      cell: ({ row }) => {
        const d = dateFormatter.format(new Date(row.getValue("dateOfBirth")));
        return <div>{d}</div>;
      },
    }),
    columnHelper.accessor("dateOfEntry", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("dateOfEntry")} />
      ),
      cell: ({ row }) => {
        const d = dateFormatter.format(new Date(row.getValue("dateOfEntry")));
        return <div>{d}</div>;
      },
    }),
    columnHelper.accessor("dateOfExit", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("dateOfExit")} />
      ),
      cell: ({ row }) => {
        const d = dateFormatter.format(new Date(row.getValue("dateOfExit")));
        return <div>{d}</div>;
      },
    }),
    columnHelper.accessor("residence", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("residence")} />
      ),
      cell: (info) => info.getValue(),
      enableSorting: true,
    }),
    columnHelper.accessor("placeOfBirth", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("placeOfBirth")} />
      ),
      cell: (info) => info.getValue(),
      enableSorting: true,
    }),
    columnHelper.accessor("country", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("country")} />
      ),
      cell: ({ row }) => {
        const countryId = row.original.country?.id as RPNInput.Country;
        const Flag = countryId && flags[countryId];
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
    }),
    columnHelper.accessor("phoneNumber", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("phone")} />
      ),
      cell: (info) => info.getValue(),
      enableSorting: true,
    }),
    columnHelper.accessor("observation", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("observation")} />
      ),
      cell: (info) => info.getValue(),
    }),

    {
      id: "actions",
      cell: ({ row }: { row: Row<Student> }) => <ActionsCell row={row} />,
    },
  ] as ColumnDef<Student, unknown>[];
}

export function fetchFilterableColumns({
  t,
}: {
  t: TFunction<string, unknown>;
}): DataTableFilterableColumn<Student>[] {
  return [
    {
      id: "gender",
      title: t("gender"),
      options: ["female", "male"].map((gender) => ({
        label: t(gender),
        value: gender,
      })),
    },
  ];
}

function ActionsCell({ row }: { row: Row<Student> }) {
  //const [isUpdatePending, startUpdateTransition] = React.useTransition();
  const [isDeletePending, startDeleteTransition] = React.useTransition();
  const { createQueryString } = useCreateQueryString();
  const { t } = useLocale();

  return (
    <div className="flex flex-row justify-end gap-2">
      <ViewButton
        asLink
        href={`${routes.students.index}/?${createQueryString({ id: row.original.id })}`}
      />
      <EditButton
        onClick={() => {
          console.log("edit");
        }}
      />

      <DeletePopover
        onDelete={() => {
          startDeleteTransition(() => {
            row.toggleSelected(false);

            // toast.promise((row.original.id), {
            //   loading: t("deleting"),
            //   success: async () => {
            //     return t("deleted");
            //   },
            //   error: (err: unknown) => getErrorMessage(err),
            // });
          });
        }}
        disabled={isDeletePending}
        title={t("delete", { name: row.original.lastName })}
        description={t("delete_confirmation")}
      />
    </div>
  );
}
