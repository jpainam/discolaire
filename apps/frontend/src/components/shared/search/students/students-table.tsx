"use client";

export function StudentsTable() {
  // const {
  //   data: students,
  //   isPending,
  //   error,
  // } = useQuery({
  //   queryKey: ["students"],
  //   queryFn: async () => {

  //     return data;
  //   },
  // });

  // const { t } = useLocale();
  // const { fullDateFormatter } = useDateFormat();
  // if (error) {
  //   showErrorToast(error);
  // }

  // //const { schoolYearId } = useSchoolYear();
  // const schoolYearId = "2022-2023";
  // const columns = useMemo<ColumnDef<Student, unknown>[]>(
  //   () =>
  //     fetchStudentColumns({
  //       t: t,
  //       dateFormatter: fullDateFormatter,
  //       schoolYearId: schoolYearId ?? "",
  //     }),
  //   [] // eslint-disable-line react-hooks/exhaustive-deps
  // );
  // const filterableColumns = fetchFilterableColumns({ t: t });
  // const { table } = useDataTable({
  //   data: students || [],
  //   columns: columns,

  //   pageCount: Math.ceil(students?.length ?? 0 / 20),
  // });
  return (
    <>
      {/* {isPending ? (
        <DataTableSkeleton rowCount={15} columnCount={8} />
      ) : (
        <DataTable
          filterableColumns={filterableColumns}
          table={table}
          variant="compact"
          topBarContent={TopBarContent(table)}
          searchPlaceholder={t("search")}
          columns={columns}
          deleteRowsAction={(event) => deleteSelectedRows({ table, event, t })}
        />
      )} */}
    </>
  );
}
