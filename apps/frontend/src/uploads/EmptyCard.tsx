import { ImageIcon } from "@radix-ui/react-icons";

import { Card, CardDescription, CardTitle } from "@repo/ui/components/card";
import { cn } from "@repo/ui/lib/utils";

interface EmptyCardProps extends React.ComponentPropsWithoutRef<typeof Card> {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}

export function EmptyCard({
  title,
  description,
  icon: Icon = ImageIcon,
  action,
  className,
  ...props
}: EmptyCardProps) {
  return (
    <Card
      className={cn(
        "flex w-full flex-col items-center justify-center space-y-6 bg-transparent p-16",
        className,
      )}
      {...props}
    >
      <div className="mr-4 shrink-0 rounded-full border border-dashed p-4">
        <Icon className="text-muted-foreground size-8" aria-hidden="true" />
      </div>
      <div className="flex flex-col items-center gap-1.5 text-center">
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </div>
      {action ?? null}
    </Card>
  );
}
