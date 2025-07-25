import type { Table } from "@tanstack/react-table";
import * as React from "react";
import {
  ArrowUpIcon,
  CheckCircledIcon,
  Cross2Icon,
  DownloadIcon,
  ReloadIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { SelectTrigger } from "@radix-ui/react-select";

import type { Student } from "@repo/db";
import { Button } from "@repo/ui/components/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@repo/ui/components/select";
import { Separator } from "@repo/ui/components/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/ui/components/tooltip";

import { Kbd } from "~/components/kbd";
import { exportTableToCSV } from "~/lib/export";

interface ClassroomTableFloatingBarProps {
  table: Table<Student>;
}

export function StudentDataTableBar({ table }: ClassroomTableFloatingBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows;

  const [isPending, startTransition] = React.useTransition();
  const [method, setMethod] = React.useState<
    "update-status" | "update-priority" | "export" | "delete"
  >();

  // Clear selection on Escape key press
  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        table.toggleAllRowsSelected(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [table]);

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 mx-auto w-fit px-4">
      <div className="w-full overflow-x-auto">
        <div className="bg-card mx-auto flex w-fit items-center gap-2 rounded-md border p-2 shadow-2xl">
          <div className="flex h-7 items-center rounded-md border border-dashed pr-1 pl-2.5">
            <span className="text-xs whitespace-nowrap">
              {rows.length} selected
            </span>
            <Separator orientation="vertical" className="mr-1 ml-2" />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-5 hover:border"
                  onClick={() => table.toggleAllRowsSelected(false)}
                >
                  <Cross2Icon
                    className="size-3.5 shrink-0"
                    aria-hidden="true"
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-accent text-foreground flex items-center border px-2 py-1 font-semibold dark:bg-zinc-900">
                <p className="mr-2">Clear selection</p>
                <Kbd abbrTitle="Escape" variant="outline">
                  Esc
                </Kbd>
              </TooltipContent>
            </Tooltip>
          </div>
          <Separator orientation="vertical" className="hidden h-5 sm:block" />
          <div className="flex items-center gap-1.5">
            <Select
            // onValueChange={(value: Classroom["status"]) => {
            //   setMethod("update-status");

            //   startTransition(async () => {
            //     const { error } = await updateTasks({
            //       ids: rows.map((row) => row.original.id),
            //       status: value,
            //     });

            //     if (error) {
            //       toast.error(error);
            //       return;
            //     }

            //     toast.success("Tasks updated");
            //   });
            // }}
            >
              <Tooltip>
                <SelectTrigger asChild>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="data-[state=open]:bg-accent data-[state=open]:text-accent-foreground size-7 border"
                      disabled={isPending}
                    >
                      {isPending && method === "update-status" ? (
                        <ReloadIcon
                          className="size-3.5 animate-spin"
                          aria-hidden="true"
                        />
                      ) : (
                        <CheckCircledIcon
                          className="size-3.5"
                          aria-hidden="true"
                        />
                      )}
                    </Button>
                  </TooltipTrigger>
                </SelectTrigger>
                <TooltipContent className="bg-accent text-foreground border font-semibold dark:bg-zinc-900">
                  <p>Update status</p>
                </TooltipContent>
              </Tooltip>
              <SelectContent align="center">
                <SelectGroup>
                  <SelectItem value={"status"} className="capitalize">
                    Status item
                  </SelectItem>
                  {/* {tasks.status.enumValues.map((status) => (
                    <SelectItem
                      key={status}
                      value={status}
                      className="capitalize"
                    >
                      {status}
                    </SelectItem>
                  ))} */}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select
            // onValueChange={(value: Task["priority"]) => {
            //   setMethod("update-priority");

            //   startTransition(async () => {
            //     const { error } = await updateTasks({
            //       ids: rows.map((row) => row.original.id),
            //       priority: value,
            //     });

            //     if (error) {
            //       toast.error(error);
            //       return;
            //     }

            //     toast.success("Tasks updated");
            //   });
            // }}
            >
              <Tooltip>
                <SelectTrigger asChild>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="data-[state=open]:bg-accent data-[state=open]:text-accent-foreground size-7 border"
                      disabled={isPending}
                    >
                      {isPending && method === "update-priority" ? (
                        <ReloadIcon
                          className="size-3.5 animate-spin"
                          aria-hidden="true"
                        />
                      ) : (
                        <ArrowUpIcon className="size-3.5" aria-hidden="true" />
                      )}
                    </Button>
                  </TooltipTrigger>
                </SelectTrigger>
                <TooltipContent className="bg-accent text-foreground border font-semibold dark:bg-zinc-900">
                  <p>Update priority</p>
                </TooltipContent>
              </Tooltip>
              <SelectContent align="center">
                <SelectGroup>
                  {/* {tasks.priority.enumValues.map((priority) => (
                    <SelectItem
                      key={priority}
                      value={priority}
                      className="capitalize"
                    >
                      {priority}
                    </SelectItem>
                  ))} */}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="size-7 border"
                  onClick={() => {
                    setMethod("export");

                    startTransition(() => {
                      exportTableToCSV(table, {
                        excludeColumns: ["select", "actions"],
                        onlySelected: true,
                      });
                    });
                  }}
                  disabled={isPending}
                >
                  {isPending && method === "export" ? (
                    <ReloadIcon
                      className="size-3.5 animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <DownloadIcon className="size-3.5" aria-hidden="true" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-accent text-foreground border font-semibold dark:bg-zinc-900">
                <p>Export tasks</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="size-7 border"
                  onClick={() => {
                    setMethod("delete");

                    // startTransition(async () => {
                    //   const { error } = await deleteTasks({
                    //     ids: rows.map((row) => row.original.id),
                    //   });

                    //   if (error) {
                    //     toast.error(error);
                    //     return;
                    //   }

                    //   table.toggleAllRowsSelected(false);
                    // });
                  }}
                  disabled={isPending}
                >
                  {isPending && method === "delete" ? (
                    <ReloadIcon
                      className="size-3.5 animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <TrashIcon className="size-3.5" aria-hidden="true" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-accent text-foreground border font-semibold dark:bg-zinc-900">
                <p>Delete tasks</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}
