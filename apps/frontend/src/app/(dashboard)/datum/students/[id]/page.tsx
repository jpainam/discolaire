import { Suspense } from "react";
import { DataTableSkeleton } from "@repo/ui/data-table/data-table-skeleton";

import { getServerTranslations } from "~/app/i18n/server";
import { StudentDetails } from "~/components/students/profile/StudentDetails";

type SearchParams = {
  [key: string]: string | string[] | undefined;
};

export default async function Page({
  params: { id },
  searchParams,
}: {
  params: { id: string };
  searchParams: SearchParams;
}) {
  const { t } = await getServerTranslations();

  return (
    <div className="flex w-full flex-col p-1">
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
