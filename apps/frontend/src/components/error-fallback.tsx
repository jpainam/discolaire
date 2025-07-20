"use client";

import { env } from "~/env";

export function ErrorFallback({
  error,
  reset,
}: {
  error: Error;
  reset?: () => void;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4">
      <div>
        <h2 className="text-md">
          {env.NODE_ENV == "production"
            ? "Something went wrong"
            : error.message}
        </h2>
      </div>
      <button onClick={() => reset?.()}>Try again</button>
    </div>
  );
}
