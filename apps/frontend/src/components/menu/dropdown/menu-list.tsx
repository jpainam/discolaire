/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef, useRef } from "react";

import { cn } from "@repo/lib";

import { useMenuContext } from "~/components/menu/dropdown/menu-context";
import Popover from "~/components/menu/popover/popover";
import { useMergedRef } from "~/components/menu/popover/use-merged-ref";

export interface MenuListProps {
  as?: React.ElementType;
  children?: React.ReactNode;
  className?: string;
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>;
  shadow?: "sm" | "md" | "lg" | "xl" | "none";
  size?: "sm" | "md" | "lg" | "xl";
  rounded?: "sm" | "md" | "lg" | "pill" | "none";
}

export const MenuList = forwardRef<
  HTMLElement,
  MenuListProps & React.HTMLProps<HTMLDivElement>
>(
  (
    {
      as = "ul",
      children,
      className,
      shadow,
      size,
      rounded,
      onMouseEnter,
      onMouseLeave,
      ...props
    },
    ref,
  ) => {
    const Component = as;
    const { trigger, openDropdown, closeDropdown } = useMenuContext();
    const wrapperRef = useRef<HTMLElement>(null);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();
        wrapperRef.current
          ?.querySelectorAll<HTMLButtonElement>(
            "[data-menu-item]:not(:disabled)",
          )[0]
          ?.focus();
      }
    };

    const handleMouseEnter = (event?: any) => {
      onMouseEnter?.(event);
      if (trigger === "hover" || trigger === "click-hover") {
        openDropdown();
      }
    };

    const handleMouseLeave = (event?: any) => {
      onMouseLeave?.(event);
      if (trigger === "hover" || trigger === "click-hover") {
        closeDropdown();
      }
    };

    return (
      <Popover.Content
        as={Component}
        {...props}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="menuList"
        ref={useMergedRef(ref, wrapperRef)}
        tabIndex={-1}
        data-menu-dropdown
        className={cn("w-48", className)}
        // @ts-expect-error TODO fix this
        onKeyDown={handleKeyDown}
        shadow={shadow}
        size={size}
        rounded={rounded}
      >
        {children}
      </Popover.Content>
    );
  },
);

MenuList.displayName = "MenuList";
