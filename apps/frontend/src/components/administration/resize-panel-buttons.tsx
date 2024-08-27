"use client";

import { useContext, useState } from "react";
import {
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";

import { Button } from "@repo/ui/button";

import { AdminPanelContext } from "~/contexts/admin-panel-provider";

export function LeftPanelButton({ panelSize }: { panelSize?: number }) {
  const [size, setSize] = useState(20);
  const panelRef = useContext(AdminPanelContext);
  const setPanelSize = (size: number) => {
    panelRef?.leftPanelRef.current?.resize(size);
  };
  return (
    <Button
      onClick={() => {
        if (panelRef?.leftPanelRef.current?.isCollapsed()) {
          panelRef.leftPanelRef.current.expand();
        } else {
          panelRef?.leftPanelRef.current?.collapse();
        }
      }}
      variant="ghost"
      size="icon"
    >
      {panelRef?.leftPanelRef.current?.isCollapsed() ? (
        <PanelLeftClose className="h-4 w-4" />
      ) : (
        <PanelLeftOpen className="h-4 w-4" />
      )}
    </Button>
  );
}

export function RightPanelButton() {
  const panelRef = useContext(AdminPanelContext);
  return (
    <Button
      onClick={() => {
        console.log("panelRef", panelRef?.rightPanelRef.current?.isCollapsed());
        if (panelRef?.rightPanelRef.current?.isCollapsed()) {
          panelRef.rightPanelRef.current.expand();
        } else {
          console.log("Collapsing right panel");
          panelRef?.rightPanelRef.current?.collapse();
        }
      }}
      variant="ghost"
      size="icon"
    >
      {panelRef?.rightPanelRef.current?.isCollapsed() ? (
        <PanelRightClose className="h-4 w-4" />
      ) : (
        <PanelRightOpen className="h-4 w-4" />
      )}
    </Button>
  );
}
