"use client";
import React, { useRef } from "react";
import { ImperativePanelHandle } from "react-resizable-panels";

export const AdminPanelContext = React.createContext<{
  leftPanelRef: React.RefObject<ImperativePanelHandle>;
  middlePanelRef: React.RefObject<ImperativePanelHandle>;
  rightPanelRef: React.RefObject<ImperativePanelHandle>;
} | null>(null);

const AdminPanelContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const leftPanelRef = useRef<ImperativePanelHandle>(null);
  const middlePanelRef = useRef<ImperativePanelHandle>(null);
  const rightPanelRef = useRef<ImperativePanelHandle>(null);
  return (
    <AdminPanelContext.Provider
      value={{
        leftPanelRef: leftPanelRef,
        middlePanelRef: middlePanelRef,
        rightPanelRef: rightPanelRef,
      }}
    >
      {children}
    </AdminPanelContext.Provider>
  );
};

export default AdminPanelContextProvider;
