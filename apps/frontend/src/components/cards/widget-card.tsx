import type { ForwardedRef } from "react";
import { forwardRef } from "react";

import { cn } from "~/lib/utils";

const widgetCardClasses = {
  base: "border border-muted p-2",
  rounded: {
    sm: "rounded-sm",
    DEFAULT: "rounded-lg",
    lg: "rounded-xl",
    xl: "rounded-2xl",
  },
};

interface WidgetCardTypes {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  rounded?: keyof typeof widgetCardClasses.rounded;
  headerClassName?: string;
  titleClassName?: string;
  actionClassName?: string;
  descriptionClassName?: string;
  className?: string;
}

function WidgetCard(
  {
    title,
    action,
    description,
    rounded = "DEFAULT",
    className,
    headerClassName,
    actionClassName,
    titleClassName,
    descriptionClassName,
    children,
  }: React.PropsWithChildren<WidgetCardTypes>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      className={cn(
        widgetCardClasses.base,
        widgetCardClasses.rounded[rounded],
        className,
      )}
      ref={ref}
    >
      <div
        className={cn(
          action && "flex items-start justify-between",
          headerClassName,
        )}
      >
        <div>
          {title && (
            <h3
              className={cn(
                "text-base font-semibold sm:text-lg",
                titleClassName,
              )}
            >
              {title}
            </h3>
          )}
          {description && (
            <div className={descriptionClassName}>{description}</div>
          )}
        </div>
        {action && <div className={cn("ps-2", actionClassName)}>{action}</div>}
      </div>
      {children}
    </div>
  );
}

export default forwardRef(WidgetCard);
WidgetCard.displayName = "WidgetCard";
