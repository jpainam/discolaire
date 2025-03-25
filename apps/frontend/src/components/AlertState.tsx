import {
  CircleAlert,
  CircleCheckIcon,
  InfoIcon,
  TriangleAlert,
} from "lucide-react";
import type { ReactNode } from "react";

type Variant = "warning" | "error" | "success" | "info";

const variantStyles: Record<
  Variant,
  { border: string; text: string; Icon: React.ElementType }
> = {
  warning: {
    border: "border-amber-500/50",
    text: "text-amber-600",
    Icon: TriangleAlert,
  },
  error: {
    border: "border-red-500/50",
    text: "text-red-600",
    Icon: CircleAlert,
  },
  success: {
    border: "border-emerald-500/50",
    text: "text-emerald-600",
    Icon: CircleCheckIcon,
  },
  info: {
    border: "border-blue-500/50",
    text: "text-blue-600",
    Icon: InfoIcon,
  },
};

interface AlertStateProps {
  variant: Variant;
  children: ReactNode;
}

export function AlertState({ variant, children }: AlertStateProps) {
  const { border, text, Icon } = variantStyles[variant];

  return (
    <div className={`rounded-md border px-4 py-3 ${border} ${text}`}>
      <p className="text-sm">
        <Icon
          className="me-3 -mt-0.5 inline-flex opacity-60"
          size={16}
          aria-hidden="true"
        />
        {children}
      </p>
    </div>
  );
}
