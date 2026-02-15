import type React from "react";
import { createContext, useContext, useMemo } from "react";

import { authClient } from "@/utils/auth-client";

export type AuthSession = ReturnType<typeof authClient.useSession>["data"];

interface AuthContextType {
  isAuthenticated: boolean;
  isAuthPending: boolean;
  session: AuthSession;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending: isAuthPending } = authClient.useSession();

  const value = useMemo<AuthContextType>(
    () => ({
      session,
      isAuthPending,
      isAuthenticated: Boolean(session?.user),
    }),
    [session, isAuthPending],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
