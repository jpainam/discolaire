"use client";

import type { PropsWithChildren } from "react";
import { createContext, useContext, useMemo } from "react";

import type { School } from "@repo/db";
import type { Permission } from "@repo/lib/permission";

interface SchoolContextProps {
  school: School;
  permissions: Permission[];
}

export const SchoolContext = createContext<SchoolContextProps | undefined>(
  undefined,
);

//export const useSchool = () => useContext(SchoolContext);

export function useSchool() {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error(
      "useSchool must be used within a <SchoolContextProvider />",
    );
  }
  return context;
}

export const SchoolContextProvider = ({
  children,
  school,
  permissions,
}: PropsWithChildren<{ school: School; permissions: Permission[] }>) => {
  const contextValue = useMemo(
    () => ({ school, permissions }),
    [school, permissions],
  );
  return (
    <SchoolContext.Provider value={contextValue}>
      {children}
    </SchoolContext.Provider>
  );
};
