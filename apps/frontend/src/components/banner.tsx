"use client";

import type { LucideIcon } from "lucide-react";
import type { ComponentProps, HTMLAttributes, MouseEventHandler } from "react";
import { createContext, useContext } from "react";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { XIcon } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";

interface BannerContextProps {
  show: boolean;
  setShow: (show: boolean) => void;
}
export const BannerContext = createContext<BannerContextProps>({
  show: true,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setShow: () => {},
});
export type BannerProps = HTMLAttributes<HTMLDivElement> & {
  visible?: boolean;
  defaultVisible?: boolean;
  onClose?: () => void;
  inset?: boolean;
};
export const Banner = ({
  children,
  visible,
  defaultVisible = true,
  onClose,
  className,
  inset = false,
  ...props
}: BannerProps) => {
  const [show, setShow] = useControllableState({
    defaultProp: defaultVisible,
    prop: visible,
    onChange: onClose,
  });
  if (!show) {
    return null;
  }
  return (
    <BannerContext.Provider value={{ show, setShow }}>
      <div
        className={cn(
          "bg-primary text-primary-foreground flex w-full items-center justify-between gap-2 px-4 py-2",
          inset && "rounded-lg",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </BannerContext.Provider>
  );
};
export type BannerIconProps = HTMLAttributes<HTMLDivElement> & {
  icon: LucideIcon;
};
export const BannerIcon = ({
  icon: Icon,
  className,
  ...props
}: BannerIconProps) => (
  <div
    className={cn(
      "border-background/20 bg-background/10 rounded-full border p-1 shadow-sm",
      className,
    )}
    {...props}
  >
    <Icon size={16} />
  </div>
);
export type BannerTitleProps = HTMLAttributes<HTMLParagraphElement>;
export const BannerTitle = ({ className, ...props }: BannerTitleProps) => (
  <p className={cn("flex-1 text-sm", className)} {...props} />
);
export type BannerActionProps = ComponentProps<typeof Button>;
export const BannerAction = ({
  variant = "outline",
  size = "sm",
  className,
  ...props
}: BannerActionProps) => (
  <Button
    className={cn(
      "hover:bg-background/10 hover:text-background shrink-0 bg-transparent",
      className,
    )}
    size={size}
    variant={variant}
    {...props}
  />
);
export type BannerCloseProps = ComponentProps<typeof Button>;
export const BannerClose = ({
  variant = "ghost",
  size = "icon",
  onClick,
  className,
  ...props
}: BannerCloseProps) => {
  const { setShow } = useContext(BannerContext);
  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    setShow(false);
    onClick?.(e);
  };
  return (
    <Button
      className={cn(
        "hover:bg-background/10 hover:text-background shrink-0 bg-transparent",
        className,
      )}
      onClick={handleClick}
      size={size}
      variant={variant}
      {...props}
    >
      <XIcon size={18} />
    </Button>
  );
};
