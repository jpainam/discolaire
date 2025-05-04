// app/auth-context.tsx
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSegments } from "expo-router";
import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import { ActivityIndicator, View } from "react-native";
import { useSignOut, useUser } from "~/utils/auth";

interface AuthContextType {
  user: ReturnType<typeof useUser> | undefined;
  isAuthenticated: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const user = useUser();
  const router = useRouter();
  const segments = useSegments();
  const queryClient = useQueryClient();
  const signOut = useSignOut();
  const loading = user === undefined; // because useUser returns null or user; initially undefined
  const isAuthenticated = !!user;

  // Redirect if not authenticated and outside public routes
  const inAuthGroup =
    segments[0] === "login" ||
    segments[0] === "sign-up" ||
    segments[0] === "forgot-password";

  if (!loading && !isAuthenticated && !inAuthGroup) {
    router.replace("/login");
    return null;
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
