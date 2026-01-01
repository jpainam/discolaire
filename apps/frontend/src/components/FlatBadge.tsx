import type { VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "~/lib/utils";

//border border-red-500 bg-red-100 dark:bg-red-900/20 text-red-600 text-xs rounded-full px-2 py-0.5 mt-4
const flatBadgeVariants = cva(
  "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        gray: "border-gray-200 bg-gray-100 text-gray-700 dark:border-gray-800 dark:bg-gray-950/50 dark:text-gray-400",
        red: "border-red-200 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400",
        orange:
          "border-orange-200 bg-orange-100 text-orange-700 dark:border-orange-800 dark:bg-orange-950/50 dark:text-orange-400",
        yellow:
          "border-yellow-200 bg-yellow-100 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-400",
        amber:
          "border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-400",
        green:
          "border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-950/50 dark:text-green-400",
        blue: "border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-400",
        indigo:
          "border-indigo-200 bg-indigo-100 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-400",
        purple:
          "border-purple-200 bg-purple-100 text-purple-700 dark:border-purple-800 dark:bg-purple-950/50 dark:text-purple-400",
        pink: "border-pink-200 bg-pink-100 text-pink-700 dark:border-pink-800 dark:bg-pink-950/50 dark:text-pink-400",
      },
    },
    defaultVariants: {
      variant: "gray",
    },
  },
);

export interface FlatBadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof flatBadgeVariants> {}

export default function FlatBadge({
  className,
  variant,
  ...props
}: FlatBadgeProps) {
  return (
    <span
      className={cn(flatBadgeVariants({ variant }), className)}
      {...props}
    />
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
  | "pink"
  | "orange"
  | "amber";
