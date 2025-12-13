import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

export function SimpleTooltip({
  children,
  content,
  className,
}: {
  children: React.ReactNode;
  content?: string;
  className?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger className={className} asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent>
        <p>{content ?? "Tooltip content"}</p>
      </TooltipContent>
    </Tooltip>
  );
}
