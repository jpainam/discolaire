import type { PropsWithChildren } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { ErrorFallback } from "~/components/error-fallback";

export default function Layout(props: PropsWithChildren) {
  return (
    <ErrorBoundary errorComponent={ErrorFallback}>
      {props.children}
    </ErrorBoundary>
  );
}
