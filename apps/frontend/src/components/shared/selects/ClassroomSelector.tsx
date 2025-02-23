"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { toast } from "sonner";

import { useLocale } from "@repo/i18n";
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
import { Skeleton } from "@repo/ui/components/skeleton";

import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

interface ClassroomSelectorProps {
  searchPlaceholder?: string;
  placeholder?: string;
  className?: string;
  defaultValue?: string;
  disabled?: boolean;
  size?: "tiny" | "small";
  onChange?: (value: string | null | undefined) => void;
}

export function ClassroomSelector({
  searchPlaceholder,
  placeholder,
  className,
  //size = "tiny",
  disabled = false,
  defaultValue,
  onChange,
}: ClassroomSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue);

  const { t } = useLocale();
  const classroomsQuery = api.classroom.all.useQuery();

  if (classroomsQuery.isPending) {
    return <Skeleton className={cn("h-8 w-full", className)} />;
  }
  if (classroomsQuery.isError) {
    toast.error(classroomsQuery.error.message);
    return null;
  }

  const data = classroomsQuery.data;

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen} modal={false}>
        <PopoverTrigger asChild>
          <Button
            size={"sm"}
            disabled={disabled}
            //type="default"
            className={"w-full [&>span]:w-full"}
            // iconRight={
            //   <ChevronsUpDown
            //     className="text-foreground-muted"
            //     strokeWidth={2}
            //     size={14}
            //   />
            // }
          >
            {data.find((it) => it.id === value)?.name ??
              placeholder ??
              t("select_an_option")}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0"
          side="bottom"
          align="start"
          sameWidthAsTrigger={true}
        >
          <Command
            filter={(value, search) => {
              const item = data.find((it) => it.id === value);
              if (item?.name.toLowerCase().includes(search.toLowerCase())) {
                return 1;
              }
              return 0;
            }}
          >
            <CommandInput
              placeholder={searchPlaceholder ?? t("search_for_an_option")}
            />
            <CommandList>
              <CommandEmpty>{t("select_an_option")}</CommandEmpty>
              <CommandGroup>
                {classroomsQuery.data.map((item) => (
                  <CommandItem
                    key={item.id}
                    className="flex w-full cursor-pointer items-center justify-between space-x-2"
                    value={item.id}
                    onSelect={(currentValue) => {
                      onChange?.(currentValue == value ? null : currentValue);
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <span>{item.name}</span>
                    {value === item.id && (
                      <Check className="text-brand" strokeWidth={2} size={16} />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
