import React from "react";
import { Callout } from "@/components/callout";
import { useLocale } from "@/hooks/use-locale";
import { cn } from "@/lib/utils";
import { Button } from "@repo/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover";
import { PiTrashFill } from "react-icons/pi";

type DeletePopoverProps = {
  title: string;
  description: string;
  onDelete: () => void;
  disabled?: boolean;
  className?: string;
  type?: "default" | "warning" | "danger";
};

const DeletePopover = React.forwardRef(
  (
    {
      title,
      description,
      onDelete,
      type = "danger",
      className,
      disabled = false,
    }: DeletePopoverProps,
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);
    const { t } = useLocale();
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            className={cn(
              "inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded border border-muted bg-transparent p-0.5 text-destructive ring-offset-background transition-colors duration-200 hover:!border-gray-900 hover:border-primary hover:text-destructive focus:outline-none focus-visible:ring-[1.8px] focus-visible:ring-muted focus-visible:ring-offset-2 active:enabled:translate-y-px dark:backdrop-blur",
              className,
            )}
            disabled={disabled}
            size={"icon"}
            variant={"ghost"}
            aria-label="Delete Item"
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
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              ></path>
            </svg>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="z-0 m-0 p-0">
          <Callout type={type}>
            <div className="mb-0.5 flex items-start text-sm text-gray-700 sm:items-center">
              <PiTrashFill className="me-1 h-[17px] w-[17px]" /> {title}
            </div>
            <div className="mb-2 text-sm leading-relaxed text-gray-500">
              {description}
            </div>
            <div className="flex items-center justify-end">
              <Button
                size="sm"
                className="me-1.5 h-7"
                onClick={() => {
                  onDelete();
                  setOpen(false);
                }}
              >
                {t("yes")}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-7"
                onClick={() => setOpen(false)}
              >
                {t("no")}
              </Button>
            </div>
          </Callout>
        </PopoverContent>
      </Popover>
    );
  },
);

DeletePopover.displayName = "DeletePopover";
export { DeletePopover };
