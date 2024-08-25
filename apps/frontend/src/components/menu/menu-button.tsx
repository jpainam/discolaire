import type { ButtonProps } from "@repo/ui/button";
import { forwardRef } from "react";
import { Button } from "@repo/ui/button";

export const MenuButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        size="icon"
        className={className}
        variant="ghost"
        {...props}
      />
    );
  },
);

MenuButton.displayName = "MenuButton";
