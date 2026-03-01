"use client";

import type { ReactNode } from "react";

import { cn } from "~/lib/utils";

interface StatsCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  color: "primary" | "accent" | "success" | "warning";
}

const colorMap = {
  primary: "bg-primary/10 text-primary",
  accent: "bg-amber-100 text-amber-600",
  success: "bg-emerald-100 text-emerald-600",
  warning: "bg-orange-100 text-orange-600",
};

export function StatsCard({ label, value, icon, color }: StatsCardProps) {
  return (
    <div className="bg-card border-border flex items-center justify-between gap-4 rounded-xl border p-4 transition-shadow hover:shadow-md">
      <div className="min-w-0">
        <p className="text-muted-foreground truncate text-xs font-medium">
          {label}
        </p>
        <p className="text-foreground mt-1 text-2xl font-bold tracking-tight">
          {value}
        </p>
      </div>
      <div
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
          colorMap[color],
        )}
      >
        {icon}
      </div>
    </div>
  );
}
