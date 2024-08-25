"use client";

export default function AdminClassroomTable() {
  // const { t } = useLocale();

  // // Memoize the columns so they don't re-render on every render
  // const columns = React.useMemo<ColumnDef<Classroom, unknown>[]>(
  //   () => fetchClassTableColumns({ t: t }),
  //   [] // eslint-disable-line react-hooks/exhaustive-deps
  // );

  // const { table } = useDataTable({
  //   data: data || [],
  //   columns: columns,
  //   pageCount: Math.ceil((data?.length || 0) / 10),
  // });
  // return (
  //   <div className="flex flex-col h-full w-full">
  //     {isPending ? (
  //       <DataTableSkeleton rowCount={8} columnCount={14} />
  //     ) : (
  //       <DataTable
  //         table={table}
  //         columns={columns}
  //         searchPlaceholder={t("search")}
  //       />
  //     )}
  //   </div>
  // );
  return <div>Admin classroomTable</div>;
}
