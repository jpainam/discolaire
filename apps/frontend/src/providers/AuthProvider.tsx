"use client";

import type { ReactNode } from "react";
import { createContext, use, useContext, useEffect, useState } from "react";

import type { User } from "@repo/db";

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | null>(null);

export function useSession(): UserContextType {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error("useSession must be used within a AuthProvider");
  }
  return context;
}

export function AuthProvider({
  children,
  userPromise,
}: {
  children: ReactNode;
  userPromise: Promise<User | null>;
}) {
  const initialUser = use(userPromise);
  const [user, setUser] = useState<User | null>(initialUser);

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
