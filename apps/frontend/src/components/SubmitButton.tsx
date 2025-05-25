import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";
import { Loader2 } from "lucide-react";

export function SubmitButton({
  children,
  isSubmitting,
  size = "default",
  disabled = false,
  ...props
}: {
  isSubmitting: boolean;
  disabled?: boolean;
  size: "default" | "sm" | "lg";
} & React.ComponentProps<"button">) {
  return (
    <Button
      size={size}
      disabled={disabled || isSubmitting}
      {...props}
      className={cn(props.className, "relative")}
    >
      {isSubmitting ? (
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Loader2 className="w-4 h-4 animate-spin" />
        </span>
      ) : (
        children
      )}
    </Button>
  );
}
