"use client";

import type { PropsWithChildren } from "react";
import { createContext, useContext, useMemo } from "react";

import type { School, SchoolYear } from "@repo/db";

interface SchoolContextProps {
  school: School;
  permissions: {
    resource: string;
    action: "Read" | "Update" | "Create" | "Delete";
    effect: "Allow" | "Deny";
    condition?: Record<string, unknown> | null;
  }[];
  schoolYear: SchoolYear;
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
  schoolYear,
  permissions,
}: PropsWithChildren<{
  school: School;
  schoolYear: SchoolYear;
  permissions: {
    resource: string;
    action: "Read" | "Update" | "Create" | "Delete";
    effect: "Allow" | "Deny";
    condition?: Record<string, unknown> | null;
  }[];
}>) => {
  const contextValue = useMemo(
    () => ({ school, permissions, schoolYear }),
    [school, permissions, schoolYear],
  );
  return (
    <SchoolContext.Provider value={contextValue}>
      {children}
    </SchoolContext.Provider>
  );
};
