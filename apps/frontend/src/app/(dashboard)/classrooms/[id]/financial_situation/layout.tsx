import { Skeleton } from "@repo/ui/components/skeleton";
import type { PropsWithChildren } from "react";
import { Suspense } from "react";
import { FinanceHeader } from "~/components/classrooms/finances/FinanceHeader";

export default async function Layout(
  props: PropsWithChildren<{ params: Promise<{ id: string }> }>,
) {
  const params = await props.params;
  return (
    <div className="flex w-full gap-2 flex-col">
      <FinanceHeader />
      <Suspense
        key={params.id}
        fallback={
          <div className="grid grid-cols-4 gap-4 p-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        }
      >
        {props.children}
      </Suspense>
    </div>
  );
}
