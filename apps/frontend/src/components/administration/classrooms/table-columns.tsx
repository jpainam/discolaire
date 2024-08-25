// import { DataTableColumnHeader } from "@repo/ui/data-table/data-table-column-header";
// import { DeletePopover } from "~/components/shared/buttons/delete-popover";
// import { EditButton } from "~/components/shared/buttons/edit-button";
// import { ViewButton } from "~/components/shared/buttons/view-button";
// import { Checkbox } from "@repo/ui/checkbox";
// import { getErrorMessage } from "~/lib/handle-error";

// import { api } from "~/trpc/react";
// import { Classroom } from "~/types/classroom";
// import { ClassroomLevel } from "~/types/classroom_level";

// import { AppRouter } from "~/server/api/root";
// import { ColumnDef, Row, createColumnHelper } from "@tanstack/react-table";
// import { inferProcedureOutput } from "@trpc/server";
// import { TFunction, t } from "i18next";
// import React from "react";
// import { toast } from "sonner";
// import { useCreateQueryString } from "../../../hooks/create-query-string";

// type ClassroomProcedureOutput = NonNullable<
//   inferProcedureOutput<AppRouter["classroom"]["all"]>
// >[number];

// const columnHelper = createColumnHelper<ClassroomProcedureOutput>();

// export function fetchClassTableColumns({
//   t,
// }: {
//   t: TFunction<string, unknown>;
// }): ColumnDef<ClassroomProcedureOutput, unknown>[] {
//   return [
//     columnHelper.accessor<"id", string>("id", {
//       header: ({ table }) => (
//         <Checkbox
//           checked={table.getIsAllPageRowsSelected()}
//           onCheckedChange={(value) => {
//             table.toggleAllPageRowsSelected(!!value);
//           }}
//           aria-label="Select all"
//           className="translate-y-[2px]"
//         />
//       ),
//       cell: ({ row }) => (
//         <Checkbox
//           checked={row.getIsSelected()}
//           onCheckedChange={(value) => {
//             row.toggleSelected(!!value);
//           }}
//           aria-label="Select row"
//           className="translate-y-[2px]"
//         />
//       ),
//       enableSorting: false,
//       enableHiding: false,
//     }),
//     columnHelper.accessor<"shortName", string>("shortName", {
//       header: ({ column }) => (
//         <DataTableColumnHeader column={column} title="Short Name" />
//       ),
//       cell: ({ row }) => (
//         <div className="flex items-center justify-center">
//           {row.getValue("shortName")}
//         </div>
//       ),
//     }),
//     columnHelper.accessor<"reportName", string>("reportName", {
//       header: ({ column }) => (
//         <DataTableColumnHeader column={column} title={t("reportName")} />
//       ),
//       cell: ({ row }) => (
//         <div className="flex items-center justify-center">
//           {row.getValue("reportName")}
//         </div>
//       ),
//     }),
//     columnHelper.accessor<"level", ClassroomLevel>("level", {
//       header: ({ column }) => (
//         <DataTableColumnHeader column={column} title={t("level")} />
//       ),
//       cell: (info) => info.getValue()?.name,
//     }),
//     columnHelper.accessor<"size", number>("size", {
//       header: ({ column }) => (
//         <DataTableColumnHeader column={column} title={t("noStudent")} />
//       ),
//       cell: ({ row }) => (
//         <div className="flex items-center justify-center">
//           {row.getValue("size")}
//         </div>
//       ),
//     }),

//     columnHelper.accessor<"numNewStudent", number>("numNewStudent", {
//       header: ({ column }) => (
//         <DataTableColumnHeader column={column} title={t("noNewStudent")} />
//       ),
//       cell: ({ row }) => (
//         <div className="flex items-center justify-center">
//           {row.getValue("numNewStudent")}
//         </div>
//       ),
//     }),

//     columnHelper.accessor<"headTeacher", Staff>("headTeacher", {
//       header: ({ column }) => (
//         <DataTableColumnHeader column={column} title={t("head_teacher")} />
//       ),
//       cell: ({ row }) => {
//         const s = row.original.headTeacher;
//         return (
//           <div className="flex items-center justify-center">
//             {s?.lastName} {s?.firstName}
//           </div>
//         );
//       },
//     }),
//     columnHelper.accessor<"seniorAdvisor", Staff>("seniorAdvisor", {
//       header: ({ column }) => (
//         <DataTableColumnHeader column={column} title={t("senior_advisor")} />
//       ),
//       cell: ({ row }) => {
//         const s = row.original.seniorAdvisor;
//         return (
//           <div>
//             {s?.lastName} {s?.firstName}
//           </div>
//         );
//       },
//     }),

//     {
//       accessorKey: "classroomLeader",
//       header: ({ column }) => (
//         <DataTableColumnHeader column={column} title={t("classroomLeader")} />
//       ),
//       cell: ({ row }) => {
//         const leader = row.original.classroomLeader;
//         return (
//           <div className="flex items-center justify-center">
//             {leader?.lastName} {leader?.firstName}
//           </div>
//         );
//       },
//     },
//     columnHelper.accessor<"totalFees", number>("totalFees", {
//       header: ({ column }) => (
//         <DataTableColumnHeader column={column} title={t("total_fees")} />
//       ),
//       cell: ({ row }) => (
//         <div className="flex items-center justify-center">
//           {row.getValue("totalFees")}
//         </div>
//       ),
//     }),
//     {
//       id: "actions",
//       cell: ({ row }: { row: Row<Classroom> }) => <ActionsCell row={row} />,
//     },
//   ] as ColumnDef<Classroom, unknown>[];
// }

// function ActionsCell({ row }: { row: Row<Classroom> }) {
//   const [isDeletePending, startDeleteTransition] = React.useTransition();

//   const { createQueryString } = useCreateQueryString();
//   const classroomMutation = api.classroom.delete.useMutation();
//   return (
//     <div className="flex justify-end flex-row gap-2">
//       <ViewButton
//         asLink
//         href={`/classrooms/?${createQueryString({ id: row.original.id })}`}
//       />
//       <EditButton
//         asLink
//         href={`/classrooms/?${createQueryString({ id: row.original.id, edit: "yes" })}`}
//       />
//       <DeletePopover
//         title={t("delete")}
//         description={t("delete_confirmation")}
//         onDelete={() => {
//           startDeleteTransition(() => {
//             row.toggleSelected(false);

//             toast.promise(
//               classroomMutation.mutateAsync({ id: row.original.id }),
//               {
//                 loading: t("deletingm"),
//                 success: async () => {
//                   await refetch();
//                   return t("deleted_successfully");
//                 },
//                 error: (err: unknown) => getErrorMessage(err),
//               }
//             );
//           });
//         }}
//         disabled={isDeletePending}
//       />
//     </div>
//   );
// }
