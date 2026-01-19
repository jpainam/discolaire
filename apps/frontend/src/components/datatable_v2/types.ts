import type * as React from "react";

export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}

export interface DataTableFilterField<TData> {
  id: keyof TData | string;
  label: string;
  options: Option[];
}
