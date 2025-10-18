import type { PropsWithChildren } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { ErrorFallback } from "~/components/error-fallback";
import { HydrateClient } from "~/trpc/server";
import { ClassroomAttendanceHeader } from "./ClassroomAttendanceHeader";

export default function Layout(props: PropsWithChildren) {
  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <ClassroomAttendanceHeader />
      </ErrorBoundary>
      {props.children}
    </HydrateClient>
  );
}
