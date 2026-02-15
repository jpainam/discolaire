import { useCallback, useEffect, useState } from "react";

import { authClient } from "@/utils/auth-client";
import {
  hydrateSchoolYearContext,
  setSchoolYearContext,
} from "@/utils/school-year";
import { queryClient, trpc } from "@/utils/trpc";

interface UseProtectedSessionResult {
  error: string | null;
  isPending: boolean;
  retry: () => Promise<void>;
  session: ReturnType<typeof authClient.useSession>["data"];
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }
  if (typeof error === "string" && error.trim().length > 0) {
    return error;
  }
  return "Unable to initialize your session.";
}

export function useProtectedSession(): UseProtectedSessionResult {
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const [isSyncingSchoolYear, setIsSyncingSchoolYear] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userId = session?.user.id ?? null;

  const syncSchoolYearContext = useCallback(async () => {
    if (!userId) {
      setError(null);
      return;
    }

    setIsSyncingSchoolYear(true);
    setError(null);

    try {
      const currentContext = await hydrateSchoolYearContext();
      if (
        currentContext?.userId === userId &&
        currentContext.schoolYearId.length > 0
      ) {
        return;
      }

      const defaultSchoolYear = await queryClient.fetchQuery(
        trpc.schoolYear.getDefault.queryOptions({ userId }),
      );

      if (!defaultSchoolYear?.id) {
        throw new Error(
          "No default school year is configured for this account.",
        );
      }

      await setSchoolYearContext({
        userId,
        schoolYearId: defaultSchoolYear.id,
      });
    } catch (syncError) {
      setError(getErrorMessage(syncError));
    } finally {
      setIsSyncingSchoolYear(false);
    }
  }, [userId]);

  useEffect(() => {
    void syncSchoolYearContext();
  }, [syncSchoolYearContext]);

  return {
    session,
    isPending: isSessionPending || (Boolean(userId) && isSyncingSchoolYear),
    error,
    retry: syncSchoolYearContext,
  };
}
