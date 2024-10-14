"use client";

import type { PropsWithChildren } from "react";
import { createContext, useContext, useMemo } from "react";

import type { School } from "@repo/db";

interface SchoolContextProps {
  school: School;
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
}: PropsWithChildren<{ school: School }>) => {
  const contextValue = useMemo(() => ({ school }), [school]);
  return (
    <SchoolContext.Provider value={contextValue}>
      {children}
    </SchoolContext.Provider>
  );
};
