import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";
import i18next from "i18next";
import Link from "next/link";
import { useTransition } from "react";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { DataTableColumnHeader } from "@repo/ui/datatable/data-table-column-header";

import { routes } from "~/configs/routes";

type ClassroomGetAssignemntProcedureOutput = NonNullable<
  RouterOutputs["classroom"]["assignments"][number]
>;

export function fetchAssignmentTableColumns({
  t,
}: {
  t: TFunction<string, unknown>;
}): ColumnDef<ClassroomGetAssignemntProcedureOutput, unknown>[] {
  const dateFormatter = new Intl.DateTimeFormat(i18next.language, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const shortDateFormatter = new Intl.DateTimeFormat(i18next.language, {
    month: "short",
    day: "numeric",
  });
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
          }}
          aria-label="Select row"
        />
      ),
      size: 28,
      enableSorting: false,
      enableHiding: false,
    },

    {
      accessorKey: "subject",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("subject")} />
      ),
      cell: ({ row }) => {
        const subject = row.original.subject;
        return <div>{subject.course.shortName}</div>;
      },
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("title")} />
      ),
      cell: ({ row }) => {
        return (
          <Link
            className="truncate hover:text-blue-600 hover:underline"
            href={routes.classrooms.assignments.details(
              row.original.classroomId,
              row.original.id
            )}
          >
            {row.original.title}
          </Link>
        );
      },
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("description")} />
      ),
      cell: ({ row }) => {
        const description = row.original.description;
        return <div className="truncate">{description}</div>;
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("createdAt")} />
      ),
      cell: ({ row }) => {
        const createdAt = row.original.createdAt;
        return <div>{dateFormatter.format(createdAt)}</div>;
      },
    },
    {
      accessorKey: "from",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("visible")} />
      ),
      cell: ({ row }) => {
        const visibleFrom = row.original.from;
        const visibleTo = row.original.to;
        return (
          <div>
            {visibleFrom && shortDateFormatter.format(visibleFrom)} -{" "}
            {visibleTo && shortDateFormatter.format(visibleTo)}
          </div>
        );
      },
    },
    {
      accessorKey: "isActive",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("is_active")} />
      ),
      cell: ({ row }) => {
        const isActive = row.original.isActive;
        return <div>{isActive ? "YES" : "NON"}</div>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => <ActionsCell assignment={row.original} />,
    },
  ];
}

function ActionsCell({
  assignment,
}: {
  assignment: ClassroomGetAssignemntProcedureOutput;
}) {
  const [isUpdatePending, startUpdateTransition] = useTransition();

  return (
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
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup
              value={assignment.title}
              onValueChange={(_value) => {
                startUpdateTransition(() => {
                  //   toast.promise(
                  //     new Promise((resolve) => setTimeout(resolve, 5000)),
                  //     /*updateTaskLabel({
                  //                             id: row.original.id,
                  //                             label: value as Task["label"],
                  //                         }),*/
                  //     {
                  //       loading: "Updating...",
                  //       success: "Label updated",
                  //       error: (err) => getErrorMessage(err),
                  //     }
                  //   );
                });
              }}
            >
              {["bug", "feature", "enhancement", "documentation"].map(
                (label) => (
                  <DropdownMenuRadioItem
                    key={label}
                    value={label}
                    className="capitalize"
                    disabled={isUpdatePending}
                  >
                    {label}
                  </DropdownMenuRadioItem>
                )
              )}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            // startDeleteTransition(() => {
            //   row.toggleSelected(false);
            //   toast.promise(
            //     deleteTask({
            //       id: row.original.id,
            //     }),
            //     {
            //       loading: "Deleting...",
            //       success: () => "Task deleted",
            //       error: (err: unknown) => getErrorMessage(err),
            //     }
            //   );
            // });
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
