"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronDown, X } from "lucide-react";

import { Badge } from "@repo/ui/components/badge";
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
import { cn } from "@repo/ui/lib/utils";

import { useTRPC } from "~/trpc/react";

interface Option {
  id: string;
  label: string;
}

interface MultiSelectorProps {
  onSelect: (values: string[]) => void;
  defaultValues?: string[];
  placeholder?: string;
  className?: string;
}

export function SportMultiSelector({
  onSelect,
  defaultValues = [],
  placeholder = "Select options...",
  className,
}: MultiSelectorProps) {
  const [open, setOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>(defaultValues);
  const [options, setOptions] = useState<Option[]>([]);

  const trpc = useTRPC();
  const sportsQuery = useQuery(trpc.setting.sports.queryOptions());

  // Fetch options from API
  useEffect(() => {
    if (!sportsQuery.isPending) {
      const options = sportsQuery.data?.map((sport) => ({
        id: sport.id,
        label: sport.name,
      }));
      setOptions(options ?? []);
    }
  }, [sportsQuery.data, sportsQuery.isPending]);

  // Update parent when selection changes
  useEffect(() => {
    onSelect(selectedValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedValues]);

  const handleSelect = (optionId: string) => {
    setSelectedValues((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId],
    );
  };

  const handleRemove = (optionId: string) => {
    setSelectedValues((prev) => prev.filter((id) => id !== optionId));
  };

  const selectedOptions = options.filter((option) =>
    selectedValues.includes(option.id),
  );

  return (
    <div className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="h-auto min-h-10 w-full justify-between bg-transparent p-2"
          >
            <div className="flex flex-1 flex-wrap gap-1">
              {selectedOptions.length > 0 ? (
                selectedOptions.map((option) => (
                  <Badge
                    key={option.id}
                    variant="secondary"
                    className="text-xs"
                  >
                    {option.label}
                    <button
                      className="ring-offset-background focus:ring-ring ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-2"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleRemove(option.id);
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={() => handleRemove(option.id)}
                    >
                      <X className="text-muted-foreground hover:text-foreground h-3 w-3" />
                    </button>
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full p-0"
          align="start"
          style={{ width: "var(--radix-popover-trigger-width)" }}
        >
          <Command>
            <CommandInput placeholder="Search options..." />
            <CommandList>
              <CommandEmpty>
                {sportsQuery.isPending ? "Loading..." : "No options found."}
              </CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.id}
                    value={option.label}
                    onSelect={() => handleSelect(option.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedValues.includes(option.id)
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    {option.label}
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
