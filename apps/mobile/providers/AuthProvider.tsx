import type { PropsWithChildren } from "react";
import React, { createContext, useContext, useEffect, useState } from "react";
import { router, SplashScreen } from "expo-router";

import type { RouterOutputs } from "@repo/api";

import { api } from "~/utils/api";

void SplashScreen.preventAutoHideAsync();

interface User {
  id: string;
  name?: string;
  email: string;
  avatar: string | undefined;
}
type Session = RouterOutputs["auth"]["getSession"];
interface AuthContextProps {
  user: User | null;
  session: Session | null;
  initialized?: boolean;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  initialized: false,
  session: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);
  const sessionQuery = api.auth.getSession.useQuery();

  useEffect(() => {
    if (sessionQuery.isPending) return;
    if (sessionQuery.data) {
      setSession(sessionQuery.data);
      const user = sessionQuery.data.user;
      setUser({
        name: user.name ?? undefined,
        id: user.id,
        avatar: user.avatar,
        email: user.email ?? "",
      });
    }
    setInitialized(true);
  }, [sessionQuery.data, sessionQuery.isPending]);

  useEffect(() => {
    if (!initialized) return;
    if (session) {
      router.replace("/");
    } else {
      router.replace("/auth");
    }

    /* HACK: Something must be rendered when determining the initial auth state...
		instead of creating a loading screen, we use the SplashScreen and hide it after
		a small delay (500 ms)
		*/

    setTimeout(() => {
      void SplashScreen.hideAsync();
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized]);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        initialized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
