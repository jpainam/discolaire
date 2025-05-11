"use client";

import { env } from "~/env";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset?: () => void;
}) {
  return (
    <main className="flex h-screen flex-col items-center justify-center gap-4">
      <h2 className="text-center">
        {env.NODE_ENV == "development" ? error.message : ""}
      </h2>
      <button
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
        onClick={() => reset?.()}
      >
        Reset
      </button>
    </main>
  );
}
