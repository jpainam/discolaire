"use client";

import { useEffect } from "react";

import { useRightPanel } from "~/app/(dashboard)/RightPanelProvider";

interface StudentRightPanelMetaProps {
  studentName: string;
}

export function StudentRightPanelMeta({
  studentName,
}: StudentRightPanelMetaProps) {
  const { setContent } = useRightPanel();

  useEffect(() => {
    setContent(
      <div className="space-y-2 text-sm">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">
          Student
        </div>
        <div className="font-medium">{studentName}</div>
      </div>,
    );

    return () => {
      setContent(null);
    };
  }, [setContent, studentName]);

  return null;
}
