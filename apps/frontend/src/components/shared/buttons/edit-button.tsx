import Link from "next/link";
import { Button } from "@repo/ui/button";

import { cn } from "~/lib/utils";

interface EditButtonProps {
  asLink?: boolean;
  href?: string;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}
export function EditButton({
  asLink,
  href,
  disabled,
  onClick,
  className,
}: EditButtonProps) {
  const content = (
    <Button
      className={cn(
        "inline-flex h-7 w-7 items-center justify-center rounded border border-muted bg-transparent p-0.5 ring-offset-background transition-colors duration-200 hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-[1.8px] focus-visible:ring-muted focus-visible:ring-offset-2 active:enabled:translate-y-px dark:backdrop-blur",
        className,
      )}
      size={"icon"}
      variant={"ghost"}
      disabled={disabled}
      aria-label="Edit"
      onClick={onClick}
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
          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
        ></path>
      </svg>
    </Button>
  );
  if (asLink) {
    return <Link href={href ?? ""}>{content}</Link>;
  }
  return content;
}
