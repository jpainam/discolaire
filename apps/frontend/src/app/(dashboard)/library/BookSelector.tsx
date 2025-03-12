import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

import { Button } from "@repo/ui/components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@repo/ui/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/popover";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import { Skeleton } from "@repo/ui/components/skeleton";
import { useLocale } from "~/i18n";

import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

interface BookSelectorProps {
  className?: string;
  disabled?: boolean;
  defaultValue?: number;
  onChange: (value: number | undefined) => void;
}

export const BookSelector = ({
  className,
  disabled = false,
  onChange,
  defaultValue,
}: BookSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<number>(defaultValue ?? -1);
  const { t } = useLocale();

  const booksQuery = api.book.all.useQuery();

  if (booksQuery.isPending) {
    return <Skeleton className={cn("h-8 w-[250px]", className)} />;
  }

  const data = booksQuery.data ?? [];
  return (
    <div>
      <Popover open={open} onOpenChange={setOpen} modal={false}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            disabled={disabled}
            className={cn(`w-[250px] justify-between`, className)}
          >
            {value && value !== -1
              ? data.find((b) => b.id == Number(value))?.title
              : t("select_an_option")}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          style={{ width: "var(--radix-popover-trigger-width)" }}
          className="p-0"
          side="bottom"
          align="start"
        >
          <Command>
            <CommandInput placeholder={t("search_for_an_option")} />
            <CommandList>
              <CommandEmpty>{t("no_data")}</CommandEmpty>
              <CommandGroup>
                <ScrollArea className={data.length > 7 ? "h-[210px]" : ""}>
                  {data.map((b) => (
                    <CommandItem
                      key={b.id}
                      className="flex w-full cursor-pointer items-center justify-between space-x-2"
                      onSelect={(_selectedValue) => {
                        const v = b.id == Number(value) ? undefined : b.id;
                        onChange(v);
                        setValue(v ?? -1);
                        setOpen(false);
                      }}
                    >
                      <span>{b.title}</span>
                      {Number(value) === b.id && (
                        <Check
                          className="text-brand"
                          strokeWidth={2}
                          size={16}
                        />
                      )}
                    </CommandItem>
                  ))}
                </ScrollArea>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
