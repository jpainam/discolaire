import { Loader2 } from "lucide-react";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export function SubmitButton({
  children,
  isSubmitting,
  size = "default",
  disabled = false,
  ...props
}: {
  isSubmitting: boolean;
  disabled?: boolean;
  size?: "default" | "sm" | "lg";
} & React.ComponentProps<"button">) {
  return (
    <Button
      size={size}
      disabled={disabled || isSubmitting}
      {...props}
      className={cn(props.className, "relative")}
    >
      {isSubmitting ? (
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Loader2 className="h-4 w-4 animate-spin" />
        </span>
      ) : (
        children
      )}
    </Button>
  );
}
