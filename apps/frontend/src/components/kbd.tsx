import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "~/lib/utils";

const kbdVariants = cva(
  "rounded border px-1.5 py-px font-mono text-[0.7rem] font-normal shadow-sm select-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-accent text-accent-foreground",
        outline: "bg-background text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface KbdProps
  extends React.ComponentPropsWithoutRef<"kbd">,
    VariantProps<typeof kbdVariants> {
  /**
   * The title of the `abbr` element inside the `kbd` element.
   * @default undefined
   * @type string | undefined
   * @example title="Command"
   */
  abbrTitle?: string;
}

const Kbd = React.forwardRef<HTMLUnknownElement, KbdProps>(
  ({ abbrTitle, children, className, variant, ...props }, ref) => {
    return (
      <kbd
        className={cn(kbdVariants({ variant, className }))}
        ref={ref}
        {...props}
      >
        {abbrTitle ? (
          <abbr title={abbrTitle} className="no-underline">
            {children}
          </abbr>
        ) : (
          children
        )}
      </kbd>
    );
  },
);
Kbd.displayName = "Kbd";

export { Kbd };
