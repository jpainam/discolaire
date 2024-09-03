import { Suspense } from "react";

import { DataTableSkeleton } from "@repo/ui/data-table/data-table-skeleton";

import { StudentDetails } from "~/components/students/profile/StudentDetails";

//type SearchParams = Record<string, string | string[] | undefined>;

export default function Page({ params: { id } }: { params: { id: string } }) {
  return (
    <div className="flex w-full flex-col">
      <Suspense
        key={id}
        fallback={
          <DataTableSkeleton
            rowCount={10}
            columnCount={8}
            withPagination={false}
            showViewOptions={false}
          />
        }
      >
        <StudentDetails id={id} />
      </Suspense>
    </div>
  );
}
