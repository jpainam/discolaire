"use client";

import { data } from "~/components/dashboard/task";

//import { getColumns } from "~/app/(dashboard)/task/columns";
//import { DataTable } from "~/components/shared/data-table";
export default function ADataTable() {
  const tasks = data;
  //const columns = useMemo(() => getColumns(), []);
  return <div></div>;
  /*<DataTable data={tasks} columns={columns} />*/
}
