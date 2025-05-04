// app/auth-context.tsx
import { useQuery } from "@tanstack/react-query";
import { router, useSegments } from "expo-router";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import type { RouterOutputs } from "~/utils/api";
import { trpc } from "~/utils/api";
import { useSignOut } from "~/utils/auth";

type SessionType = RouterOutputs["auth"]["getSession"];
interface AuthContextType {
  session: SessionType;
  isAuthenticated: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<SessionType>(null);
  const [isLoading, setIsLoading] = useState(true);

  const signOut = useSignOut();
  const segments = useSegments();
  const sessionQuery = useQuery(trpc.auth.getSession.queryOptions());

  useEffect(() => {
    if (sessionQuery.isPending) return;
    setIsLoading(false);
    if (sessionQuery.isError) {
      setSession(null);
      return;
    }

    const sess = sessionQuery.data;
    if (sess) {
      setSession(sess);
    } else {
      setSession(null);
      if (segments[0] !== "auth") {
        router.replace("/auth");
      }
    }
  }, [
    segments,
    sessionQuery.data,
    sessionQuery.error,
    sessionQuery.isError,
    sessionQuery.isPending,
  ]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        isAuthenticated: !!session?.user,
        loading: isLoading,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useSession = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useSession must be used within AuthProvider");
  return ctx;
};
