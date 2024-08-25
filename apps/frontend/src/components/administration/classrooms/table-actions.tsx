// import { Table } from "@tanstack/react-table";

// import { DeletePopover } from "@/components/shared/buttons/delete-popover";
// import { ExportButton } from "@/components/shared/buttons/export-button";
// import { getErrorMessage } from "@/lib/handle-error";

// import { api } from "@/trpc/react";
// import { Classroom } from "@/types/classroom";
// import { toast } from "sonner";

// export function deleteSelectedRows({
//   table,
//   //event,
//   refetch,
// }: {
//   table: Table<Classroom>;
//   //event?: React.MouseEvent<HTMLButtonElement, MouseEvent>;
//   refetch: () => void;
// }) {
//   //event?.preventDefault();
//   const selectedRows = table.getFilteredSelectedRowModel().rows as {
//     original: Classroom;
//   }[];

//   const classroomMutation = api.classroom.delete.useMutation();

//   toast.promise(
//     Promise.all(
//       selectedRows.map(async (row) =>
//         classroomMutation.mutate({ id: row.original.id })
//       )
//     ),
//     {
//       loading: "Deleting...",
//       success: async (data) => {
//         await refetch();
//         return "Tasks deleted";
//       },
//       error: (err) => getErrorMessage(err),
//     }
//   );
// }

// export function ClassesTableFloatingBarContent(table: Table<Classroom>) {

//   return (
//     <div className="justify-end flex gap-2 align-middle">
//       <DeletePopover
//         title="Delete"
//         description="Are you sure you want to delete the selected tasks?"
//         onDelete={() => {
//           table.toggleAllPageRowsSelected(false);
//           deleteSelectedRows?.({ table, refetch });
//         }}
//       />
//     </div>
//   );
// }

// export function ClassesTopBarContent(table: Table<Classroom>) {
//   return <ExportButton />;
// }
