/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FloatingPosition } from "~/components/menu/popover/types";
import type { PopoverWidth } from "~/components/menu/popover/use-popover";
import type { PortalProps } from "~/components/Portal";
import { createContextHook } from "~/components/menu/popover/create-custom-context";

interface PopoverContextProps {
  x: number;
  y: number;
  opened: boolean;
  reference: (node: HTMLElement) => void;
  floating: (node: HTMLElement) => void;
  width?: PopoverWidth;
  trapFocus: boolean | undefined;
  placement: FloatingPosition;
  withinPortal: boolean | undefined;
  portalProps?: Omit<PortalProps, "children">;
  onClose?: () => void;
  getDropdownId: () => string;
  getTargetId: () => string;
  controlled: boolean;
  onToggle: () => void;
  withRoles: boolean | undefined;
  targetProps: Record<string, any>;
  disabled: boolean | undefined;
  classNames: string | undefined;
  as: string;
  closeOnEscape?: boolean | undefined;
  returnFocus?: boolean | undefined;
  keepMounted?: boolean | undefined;
}

export const [PopoverContextProvider, usePopoverContext] =
  createContextHook<PopoverContextProps>(
    "Popover component was not found in the tree",
  );
