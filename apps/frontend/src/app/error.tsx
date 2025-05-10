"use client";

import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

import { useLocale } from "~/i18n";

import { routes } from "~/configs/routes";
import { env } from "~/env";
import { useRouter } from "~/hooks/use-router";

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
    console.error(">>>>>>>>Error from error.tsx", error);
    if (error.message === "UNAUTHORIZED") {
      setTimeout(() => {
        window.location.href = routes.auth.login;
      }, 0);
    } else {
      setIsLoading(false);
    }
  }, [error, router]);
  const { t } = useLocale();
  return (
    <main className="flex h-screen flex-col items-center justify-center gap-4">
      {isLoading ? (
        <Loader className="h-6 w-6 animate-spin" />
      ) : (
        <>
          <h2 className="text-center">
            {t("your_session_has_expired")}
            {env.NODE_ENV == "development" ? error.message : ""}
          </h2>
          <button
            className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
            onClick={
              // Attempt to recover by trying to re-render the invoices route
              () => router.push("/auth/login")
            }
          >
            {t("click_here")}
          </button>
          <button onClick={() => reset()}></button>
        </>
      )}
    </main>
  );
}
