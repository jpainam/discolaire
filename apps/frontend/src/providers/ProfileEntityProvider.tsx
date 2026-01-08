"use client";

import type { PropsWithChildren } from "react";
import { createContext, useContext, useMemo } from "react";

interface EntityProfileContextProps {
  profile: "contact" | "student" | "staff";
  name: string;
  entityId: string;
}

export const EntityProfileContext = createContext<
  EntityProfileContextProps | undefined
>(undefined);

export function useEntityProfile() {
  const context = useContext(EntityProfileContext);
  if (!context) {
    throw new Error(
      "useEntityProfile must be used within a <EntityProfileProvider />",
    );
  }
  return context;
}

export const EntityProfileProvider = ({
  children,
  profile,
  entityId,
  name,
}: PropsWithChildren<{
  profile: "contact" | "student" | "staff";
  entityId: string;
  name: string;
}>) => {
  const contextValue = useMemo(
    () => ({ profile, entityId, name }),
    [profile, entityId, name],
  );
  return (
    <EntityProfileContext.Provider value={contextValue}>
      {children}
    </EntityProfileContext.Provider>
  );
};
