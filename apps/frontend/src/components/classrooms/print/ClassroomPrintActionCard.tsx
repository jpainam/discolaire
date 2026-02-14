/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Download } from "lucide-react";

import type { ClassroomPrintParamKey } from "./classroom-print-registry";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface ClassroomPrintActionCardProps {
  id: string;
  label: string;
  description?: string;
  disabled?: boolean;
  missingParams?: ClassroomPrintParamKey[];
  missingParamLabels?: Record<ClassroomPrintParamKey, string>;
  onClick: () => void;
}

export function ClassroomPrintActionCard({
  id,
  label,
  description,
  disabled = false,
  missingParams = [],
  missingParamLabels,
  onClick,
}: ClassroomPrintActionCardProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "bg-muted/50 hover:bg-muted flex w-full items-center justify-between overflow-hidden rounded-md border p-3 text-left transition",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
      )}
    >
      <div className="space-y-1">
        <p className="font-medium">{label}</p>
        {description ? (
          <p className="text-muted-foreground text-xs">{description}</p>
        ) : null}
      </div>
      <Button
        variant="ghost"
        className="size-8"
        size="icon"
        disabled={disabled}
      >
        <Download className="size-4" />
      </Button>
    </button>
  );
}
