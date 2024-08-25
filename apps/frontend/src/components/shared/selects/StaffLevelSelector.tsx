import { useState } from "react";
import { Button } from "@repo/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@repo/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover";
import { ScrollArea } from "@repo/ui/scroll-area";
import { Skeleton } from "@repo/ui/skeleton";
import { Check, ChevronsUpDown, Plus } from "lucide-react";

import { useLocale } from "~/hooks/use-locale";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

interface StaffLevelSelectorProps {
  className?: string;
  disabled?: boolean;
  defaultValue?: string;
  onChange: (value: string) => void;
  onSelectCreateLevel?: () => void;
}

export const StaffLevelSelector = ({
  className,
  disabled = false,
  onChange,
  defaultValue,
  onSelectCreateLevel,
}: StaffLevelSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>(defaultValue || "");
  const { t } = useLocale();

  const staffLevelsQuery = api.staff.levels.useQuery();
  const staffLevels = staffLevelsQuery.data || [];

  if (staffLevelsQuery.isError) {
    throw staffLevelsQuery.error;
  }
  if (staffLevelsQuery.isPending) {
    return <Skeleton className={cn("h-8 w-[250px]", className)} />;
  }

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen} modal={false}>
        <PopoverTrigger asChild>
          <Button
            size={"sm"}
            variant={"outline"}
            disabled={disabled}
            className={cn(`w-[250px] justify-between`, className)}
          >
            {value
              ? staffLevels?.find((level) => level.id == Number(value))?.name
              : t("select_an_option")}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0"
          side="bottom"
          align="start"
          sameWidthAsTrigger={true}
        >
          <Command>
            <CommandInput placeholder={t("search_for_an_option")} />
            <CommandList>
              <CommandEmpty>{t("no_data")}</CommandEmpty>
              <CommandGroup>
                <ScrollArea
                  className={(staffLevels || []).length > 7 ? "h-[210px]" : ""}
                >
                  {staffLevels?.map((level) => (
                    <CommandItem
                      key={level.id}
                      className="flex w-full cursor-pointer items-center justify-between space-x-2"
                      onSelect={() => {
                        const v =
                          level.id == Number(value) ? undefined : level.id;
                        onChange(v?.toString() || "");
                        setValue(v?.toString() || "");
                        setOpen(false);
                      }}
                    >
                      <span>{level.name}</span>
                      {Number(value) === level.id && (
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
              {onSelectCreateLevel !== undefined && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      className="flex w-full cursor-pointer items-center gap-x-2"
                      onSelect={() => {
                        onSelectCreateLevel();
                        setOpen(false);
                      }}
                      onClick={() => {
                        onSelectCreateLevel();
                        setOpen(false);
                      }}
                    >
                      <Plus size={12} />
                      {t("createANewLevel")}
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
