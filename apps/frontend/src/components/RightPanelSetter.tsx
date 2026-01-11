"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";

import { useRightPanel } from "~/app/(dashboard)/RightPanelProvider";

export function RightPanelSetter({ content }: { content: ReactNode }) {
  const { setContent } = useRightPanel();

  useEffect(() => {
    setContent(content);
    return () => {
      setContent(null); // important so content don't "stick" when you leave the route
    };
  }, [setContent, content]);

  return null;
}
