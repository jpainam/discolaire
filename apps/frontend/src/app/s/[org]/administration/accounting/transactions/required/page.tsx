import { Suspense } from "react";

import { HydrateClient, prefetch, trpc } from "~/trpc/server";
import { RequiredDatatable } from "./RequiredDatatable";

export default async function Page(props: {
  searchParams: Promise<{
    classroom?: string;
    from?: string;
    status?: string;
    to?: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  prefetch(
    trpc.transaction.required.queryOptions({
      limit: 20,
      status: searchParams.status ?? undefined,
      from: searchParams.from ? new Date(searchParams.from) : undefined,
      to: searchParams.to ? new Date(searchParams.to) : undefined,
      classroomId: searchParams.classroom,
    }),
  );
  return (
    <HydrateClient>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="p-4">
          <RequiredDatatable />
        </div>
      </Suspense>
    </HydrateClient>
  );
}
