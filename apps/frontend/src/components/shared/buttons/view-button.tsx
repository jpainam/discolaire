import Link from "next/link";

import { Button } from "@repo/ui/button";

import { cn } from "~/lib/utils";

interface ViewButtonProps {
  asLink?: boolean;
  href?: string;
  className?: string;
  target?: string;
  onClick?: () => void;
}
export function ViewButton({
  asLink,
  href,
  target,
  className,
  onClick,
}: ViewButtonProps) {
  const content = (
    <Button
      className={cn(
        "inline-flex h-7 w-7 items-center justify-center rounded border border-muted bg-transparent p-0.5 ring-offset-background transition-colors duration-200 hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-[1.8px] focus-visible:ring-muted focus-visible:ring-offset-2 active:enabled:translate-y-px dark:backdrop-blur",
        className,
      )}
      size={"icon"}
      variant={"ghost"}
      aria-label="View"
      onClick={onClick && onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="h-4 w-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
        ></path>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        ></path>
      </svg>
    </Button>
  );
  if (asLink) {
    return (
      <Link target={target} href={href ?? ""}>
        {content}
      </Link>
    );
  }
  return content;
}
