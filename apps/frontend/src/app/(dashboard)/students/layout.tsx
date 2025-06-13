import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import type { PropsWithChildren } from "react";
import { ErrorFallback } from "~/components/error-fallback";

export default function Layout(props: PropsWithChildren) {
  return (
    <ErrorBoundary errorComponent={ErrorFallback}>
      {props.children}
    </ErrorBoundary>
  );
}
