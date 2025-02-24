"use client";

import type { PropsWithChildren } from "react";
import { createContext, useContext, useMemo } from "react";

import type { School, SchoolYear } from "@repo/db";
import type { Permission } from "~/permissions";

interface SchoolContextProps {
  school: School;
  permissions: Permission[];
  schoolYear: SchoolYear;
}

export const SchoolContext = createContext<SchoolContextProps | undefined>(
  undefined
);

//export const useSchool = () => useContext(SchoolContext);

export function useSchool() {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error(
      "useSchool must be used within a <SchoolContextProvider />"
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
  permissions: Permission[];
}>) => {
  const contextValue = useMemo(
    () => ({ school, permissions, schoolYear }),
    [school, permissions, schoolYear]
  );
  return (
    <SchoolContext.Provider value={contextValue}>
      {children}
    </SchoolContext.Provider>
  );
};
