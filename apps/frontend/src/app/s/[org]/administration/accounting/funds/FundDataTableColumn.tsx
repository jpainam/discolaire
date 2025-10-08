"use client";

import type { ColumnDef } from "@tanstack/react-table";
import i18next from "i18next";

import type { RouterOutputs } from "@repo/api";
import { Checkbox } from "@repo/ui/components/checkbox";
import { DataTableColumnHeader } from "@repo/ui/datatable/data-table-column-header";

import FlatBadge from "~/components/FlatBadge";
import { CURRENCY } from "~/lib/constants";

type FundProcedureOutput = NonNullable<RouterOutputs["fund"]["all"]>[number];

export function fetchFundColumns(): ColumnDef<FundProcedureOutput, unknown>[] {
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
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Description" />
      ),
      cell: ({ row }) => {
        return <div>{row.getValue("description")}</div>;
      },
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Montant" />
      ),
      cell: ({ row }) => {
        const f = row.original;
        return (
          <div>
            {f.amount.toLocaleString(i18next.language)} {CURRENCY}
          </div>
        );
      },
    },
    {
      accessorKey: "date",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Date"} />
      ),
      cell: ({ row }) => {
        const f = row.original;
        const hasPassed = new Date(f.date) < new Date();

        return (
          <FlatBadge variant={hasPassed ? "green" : "red"}>
            {hasPassed ? "OUI" : "NON"}
          </FlatBadge>
        );
      },
      filterFn: (row, id, value) => {
        return value instanceof Array && value.includes(row.getValue(id));
      },
    },

    // {
    //   id: "actions",
    //   cell: ({ row }) => <ActionCell fee={row.original} />,
    //   size: 60,
    //   enableSorting: false,
    //   enableHiding: false,
    // },
  ];
}

// function ActionCell({ fee }: { fee: Fee }) {
//   const { t } = useLocale();
//   const { openModal } = useModal();
//   const confirm = useConfirm();
//   const trpc = useTRPC();
//   const queryClient = useQueryClient();
//   const feeMutation = useMutation(
//     trpc.fee.delete.mutationOptions({
//       onSuccess: async () => {
//         await queryClient.invalidateQueries(trpc.fee.all.pathFilter());
//         toast.success(t("deleted_successfully"), { id: 0 });
//       },
//       onError: (error) => {
//         toast.error(error.message, { id: 0 });
//       },
//     }),
//   );

//   return (
//     <div className="flex justify-end">
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button variant={"ghost"}>
//             <MoreHorizontal className="h-4 w-4" />
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent align="end">
//           <DropdownMenuItem
//             onSelect={() => {
//               openModal({
//                 title: t("edit"),
//                 view: <CreateEditFee classroomId={fee.classroomId} fee={fee} />,
//               });
//             }}
//           >
//             <Pencil />
//             {t("edit")}
//           </DropdownMenuItem>
//           <Separator />
//           <DropdownMenuItem
//             disabled={feeMutation.isPending}
//             onSelect={async () => {
//               const isConfirmed = await confirm({
//                 title: t("delete"),
//                 confirmText: t("delete"),
//                 cancelText: t("cancel"),
//                 description: t("delete_confirmation"),
//               });
//               if (isConfirmed) {
//                 toast.loading(t("deleting"), { id: 0 });
//                 feeMutation.mutate(fee.id);
//               }
//             }}
//             variant="destructive"
//             className="dark:data-[variant=destructive]:focus:bg-destructive/10"
//           >
//             <Trash2 />
//             {t("delete")}
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </div>
//   );
// }
