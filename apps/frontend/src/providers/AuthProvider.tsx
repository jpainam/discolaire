"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";

import type { Session } from "@repo/auth";
import type { User } from "@repo/db";

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useUser(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

export function AuthProvider({
  children,
  session,
}: {
  children: ReactNode;
  session: Session | null;
}) {
  const initialUser = session?.user;
  const [user, setUser] = useState<User | null>(initialUser ?? null);

  useEffect(() => {
    setUser(initialUser ?? null);
  }, [initialUser]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
