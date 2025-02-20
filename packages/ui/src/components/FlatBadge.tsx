import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "../lib/utils";

//border border-red-500 bg-red-100 dark:bg-red-900/20 text-red-600 text-xs rounded-full px-2 py-0.5 mt-4
const flatBadgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-1 text-xs",
  {
    variants: {
      variant: {
        gray: "border-gray-500 bg-gray-100 text-gray-600 dark:bg-gray-900/20",
        red: "border-red-500 bg-red-100 text-red-600 dark:bg-red-900/20",
        orange:
          "border-orange-500 bg-orange-100 text-orange-600 dark:bg-orange-900/20",
        yellow:
          "border-yellow-500 bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20",
        green:
          "border-green-500 bg-green-100 text-green-600 dark:bg-green-900/20",
        blue: "border-blue-500 bg-blue-100 text-blue-600 dark:bg-blue-900/20",
        indigo:
          "border-indigo-500 bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20",
        purple:
          "border-purple-500 bg-purple-100 text-purple-600 dark:bg-purple-900/20",
        pink: "border-pink-500 bg-pink-100 text-pink-600 dark:bg-pink-900/20",
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
