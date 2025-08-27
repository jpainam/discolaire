/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { SplashScreen, useRouter } from "expo-router";
import type { PropsWithChildren } from "react";
import { createContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { authClient } from "~/utils/auth";

SplashScreen.preventAutoHideAsync();

interface AuthState {
  isLoggedIn: boolean;
  isReady: boolean;
  logIn: (username: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthState>({
  isLoggedIn: false,
  isReady: false,
  logIn: async () => {},
  logOut: async () => {},
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [isReady, setIsReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const { data, isPending } = authClient.useSession();

  const logIn = async (username: string, password: string) => {
    const { data, error } = await authClient.signIn.username({
      username,
      password,
    });
    console.log("Login response", { data, error });
    if (!error) {
      setIsLoggedIn(true);
      //storeAuthState({ isLoggedIn: true });
      router.replace("/");
    } else {
      Alert.alert("Login failed", error.message);
    }
  };

  const logOut = async () => {
    await authClient.signOut();
    setIsLoggedIn(false);
    router.replace("/auth/login");
  };

  useEffect(() => {
    if (!isPending) {
      if (data?.session) {
        setIsLoggedIn(true);
      }
      setIsReady(true);
    }
  }, [data?.session, isPending]);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  return (
    <AuthContext.Provider
      value={{
        isReady,
        isLoggedIn,
        logIn,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
