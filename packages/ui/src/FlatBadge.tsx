import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "./utils";

const flatBadgeVariants = cva(
  "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
  {
    variants: {
      variant: {
        gray: "bg-gray-50 text-gray-600 ring-gray-500/10 dark:bg-gray-700/10 dark:text-gray-50",
        red: "dark:ring-red-60/10 bg-red-50 text-red-700 ring-red-600/10 dark:bg-red-700/10 dark:text-red-50",
        yellow:
          "bg-yellow-50 text-yellow-800 ring-yellow-600/20 dark:bg-yellow-400/10 dark:text-yellow-50",
        green:
          "bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-700/10 dark:text-green-50",
        blue: "bg-blue-50 text-blue-700 ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-50",
        indigo:
          "bg-indigo-50 text-indigo-700 ring-indigo-700/10 dark:bg-indigo-400/10 dark:text-indigo-50",
        purple:
          "bg-purple-50 text-purple-700 ring-purple-700/10 dark:bg-purple-700/10 dark:text-purple-50",
        pink: "bg-pink-50 text-pink-700 ring-pink-700/10 dark:bg-pink-400/10 dark:text-pink-50",
      },
    },
    defaultVariants: {
      variant: "gray",
    },
  },
);

export interface FlatBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof flatBadgeVariants> {}

export default function FlatBadge({
  className,
  variant,
  ...props
}: FlatBadgeProps) {
  return (
    <div className={cn(flatBadgeVariants({ variant }), className)} {...props} />
  );
}
export type FlatBadgeVariant =
  | "green"
  | "red"
  | "yellow"
  | "gray"
  | "blue"
  | "indigo"
  | "purple"
  | "pink";
