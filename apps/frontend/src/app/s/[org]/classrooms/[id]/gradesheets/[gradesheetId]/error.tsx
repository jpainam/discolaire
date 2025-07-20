"use client";

import { ErrorFallback } from "~/components/error-fallback";

export default function Error({
  error,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  reset,
}: {
  error: Error & { digest?: string };
  reset?: () => void;
}) {
  return <ErrorFallback error={error} />;
}
