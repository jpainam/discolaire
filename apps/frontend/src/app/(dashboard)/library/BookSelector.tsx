import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";

interface BookSelectorProps {
  className?: string;
  disabled?: boolean;
  defaultValue?: string;
  onChange: (value: string | undefined) => void;
}

export const BookSelector = ({
  className,
  disabled = false,
  onChange,
  defaultValue,
}: BookSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(defaultValue ?? "");

  const t = useTranslations();
  const trpc = useTRPC();
  const booksQuery = useQuery(trpc.book.all.queryOptions());

  if (booksQuery.isPending) {
    return <Skeleton className={cn("h-8 w-[250px]", className)} />;
  }

  const data = booksQuery.data ?? [];
  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen} modal={false}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            disabled={disabled}
            className={cn(`w-[250px] justify-between`, className)}
          >
            {value
              ? data.find((b) => b.id == value)?.title
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
                        const v = b.id == value ? undefined : b.id;
                        onChange(v);
                        setValue(v?.toString() ?? null);
                        setOpen(false);
                      }}
                    >
                      <span>{b.title}</span>
                      {value === b.id && (
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
