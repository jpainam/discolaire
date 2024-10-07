"use client";

import type { PropsWithChildren } from "react";
import React, { createContext, useContext } from "react";

import type { School } from "@repo/db";

interface SchoolContextProps {
  school: School;
}

export const SchoolContext = createContext<SchoolContextProps>(
  {} as SchoolContextProps,
);

export const useSchool = () => useContext(SchoolContext);

// export function useSchool() {
//   const context = useContext(SchoolContext);

//   // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
//   if (!context) {
//     throw new Error(
//       "useSchool must be used within a <SchoolContextProvider />",
//     );
//   }

//   return context;
// }

export const SchoolContextProvider = ({
  children,
  school,
}: PropsWithChildren<{ school: School }>) => {
  return (
    <SchoolContext.Provider value={{ school }}>
      {children}
    </SchoolContext.Provider>
  );
};
