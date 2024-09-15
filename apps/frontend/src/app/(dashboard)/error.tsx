"use client";

import { useEffect } from "react";

import { getErrorMessage } from "~/lib/handle-error";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    document.title = "Error";
    console.error(error);
  }, [error]);

  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <h2 className="text-center">{JSON.stringify(error)}</h2>
      <div>{getErrorMessage(error)}</div>
      <button
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
        onClick={
          // Attempt to recover by trying to re-render the invoices route
          () => reset()
        }
      >
        Try again
      </button>
    </main>
  );
}
