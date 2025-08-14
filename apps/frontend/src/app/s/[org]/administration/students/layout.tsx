import type { PropsWithChildren } from "react";
import { Suspense } from "react";

import { Skeleton } from "@repo/ui/components/skeleton";

import { StudentStatAdmin } from "./StudentStatAdmin";

export default function Layout(props: PropsWithChildren) {
  return (
    <div className="flex flex-col gap-2 py-2">
      <Suspense
        fallback={
          <div className="grid grid-cols-4 gap-4 px-4 py-2">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
        }
      >
        <StudentStatAdmin />
      </Suspense>
      {props.children}
    </div>
  );
}
