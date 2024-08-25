import { useTransition } from "react";
import Link from "next/link";
import { routes } from "@/configs/routes";
import { AppRouter } from "@/server/api/root";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Button } from "@repo/ui/button";
import { Checkbox } from "@repo/ui/checkbox";
import { DataTableColumnHeader } from "@repo/ui/data-table/data-table-column-header";
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
} from "@repo/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { inferProcedureOutput } from "@trpc/server";
import i18next, { TFunction } from "i18next";

type ClassroomGetAssignemntProcedureOutput = NonNullable<
  inferProcedureOutput<AppRouter["classroom"]["assignments"]>
>[number];

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
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
          }}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
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
        return <div>{subject?.course?.shortName}</div>;
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
              row.original.id,
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
        return <div>{createdAt ? dateFormatter.format(createdAt) : ""}</div>;
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
  const [isDeletePending, startDeleteTransition] = useTransition();

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
              onValueChange={(value) => {
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
                ),
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
          disabled={isDeletePending}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
