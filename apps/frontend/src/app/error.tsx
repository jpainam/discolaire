"use client";

import { useEffect, useState } from "react";
import { Loader } from "lucide-react";

import { useRouter } from "@repo/hooks/use-router";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    document.title = "Error";
    console.error(error);
    if (error.message === "UNAUTHORIZED") {
      router.push("/auth/login");
    } else {
      setIsLoading(false);
    }
  }, [error, router]);

  return (
    <main className="flex h-screen flex-col items-center justify-center">
      {isLoading ? (
        <Loader className="h-6 w-6 animate-spin" />
      ) : (
        <>
          <h2 className="text-center">
            Something went wrong! from {error.message}
          </h2>
          <button
            className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
            onClick={
              // Attempt to recover by trying to re-render the invoices route
              () => reset()
            }
          >
            Try again
          </button>
        </>
      )}
    </main>
  );
}
