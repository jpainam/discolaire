import type { Table } from "@tanstack/react-table";
import * as React from "react";
import { ChevronsUpDown } from "lucide-react";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";

type User = RouterOutputs["user"]["all"][number];
interface TasksTableFloatingBarProps {
  table: Table<User>;
}

export function UserDataTableAction({ table }: TasksTableFloatingBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows;

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
    <div className="animate-fadeIn fixed inset-x-0 bottom-12 z-50 mx-auto flex h-[60px] max-w-xl items-center justify-between rounded-md border bg-background px-6 py-3 shadow">
      <p className="text-sm font-semibold">{rows.length} selected</p>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"outline"}>
            Bulk Actions <ChevronsUpDown className="ml-1 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Export in csv</DropdownMenuItem>
          <DropdownMenuItem>Export in excel</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive focus:text-destructive">
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    // <div className="fixed inset-x-0 bottom-10 z-50 mx-auto w-fit px-4">
    //   <div className="w-full overflow-x-auto">
    //     <div className="shadow-3xl mx-auto flex w-fit items-center gap-2 rounded-md border bg-card p-2">
    //       <div className="flex h-7 items-center rounded-md border border-dashed pl-2.5 pr-1">
    //         <span className="whitespace-nowrap text-xs">
    //           {rows.length} selected
    //         </span>
    //         <Separator orientation="vertical" className="ml-2 mr-1" />
    //         <Tooltip>
    //           <TooltipTrigger asChild>
    //             <Button
    //               variant="ghost"
    //               size="icon"
    //               className="size-5 hover:border"
    //               onClick={() => table.toggleAllRowsSelected(false)}
    //             >
    //               <Cross2Icon
    //                 className="size-3.5 shrink-0"
    //                 aria-hidden="true"
    //               />
    //             </Button>
    //           </TooltipTrigger>
    //           <TooltipContent className="flex items-center border bg-accent px-2 py-1 font-semibold text-foreground dark:bg-zinc-900">
    //             <p className="mr-2">Clear selection</p>
    //           </TooltipContent>
    //         </Tooltip>
    //       </div>
    //       <Separator orientation="vertical" className="hidden h-5 sm:block" />
    //       <div className="flex items-center gap-1.5">
    //         <DropdownMenu>
    //           <DropdownMenuTrigger asChild>
    //             <Button variant={"outline"}>
    //               Bulk Actions
    //               <ChevronsUpDown className="ml-1 h-4 w-4" />
    //             </Button>
    //           </DropdownMenuTrigger>
    //           <DropdownMenuContent>
    //             <DropdownMenuLabel>My Account</DropdownMenuLabel>
    //             <DropdownMenuSeparator />
    //             <DropdownMenuItem>Profile</DropdownMenuItem>
    //             <DropdownMenuItem>Billing</DropdownMenuItem>
    //             <DropdownMenuItem>Team</DropdownMenuItem>
    //             <DropdownMenuItem>Subscription</DropdownMenuItem>
    //           </DropdownMenuContent>
    //         </DropdownMenu>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}
