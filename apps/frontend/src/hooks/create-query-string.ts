import { useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function useCreateQueryString() {
  const searchParams = useSearchParams();

  // example https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams
  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair

  const createQueryString = useCallback(
    (params: Record<string, string | number | null | undefined>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(params)) {
        if (value === null || value === undefined || value === "") {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }

      return newSearchParams.toString();
    },
    [searchParams],
  );

  return { createQueryString };
}
