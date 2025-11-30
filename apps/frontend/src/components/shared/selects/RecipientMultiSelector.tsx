"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Command as CommandPrimitive } from "cmdk";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "@repo/ui/components/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@repo/ui/components/command";
import { Skeleton } from "@repo/ui/components/skeleton";

import { showErrorToast } from "~/lib/handle-error";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";

export function RecipientMultiSelector({
  className,
  onChange,
  defaultValues = [],
}: {
  className?: string;
  defaultValues: string[];
  onChange?: (values: string[]) => void;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string[]>(defaultValues);
  const [selectables, setSelectables] = React.useState<string[]>([]);
  const [inputValue, setInputValue] = React.useState("");

  const t = useTranslations();
  const handleUnselect = React.useCallback((value: string) => {
    setSelected((prev) => prev.filter((s) => s !== value));
  }, []);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            setSelected((prev) => {
              const newSelected = [...prev];
              newSelected.pop();
              return newSelected;
            });
          }
        }
        // This is not a default behaviour of the <input /> field
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    [],
  );
  const trpc = useTRPC();
  const recipientsQuery = useQuery(trpc.recipient.groups.queryOptions());

  React.useEffect(() => {
    if (!recipientsQuery.data) return;
    const recipients = recipientsQuery.data;
    const _selectables = recipients.filter(
      (recipient) => !selected.includes(recipient.id),
    );
    setSelectables(_selectables.map((recipient) => recipient.id));
  }, [recipientsQuery.data, selected]);

  if (recipientsQuery.isPending) {
    return <Skeleton className="h-10 w-full" />;
  }
  if (recipientsQuery.isError) {
    showErrorToast(recipientsQuery.error);
    return;
  }

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
    >
      <div className="group border-input ring-offset-background focus-within:ring-ring rounded-md border px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1">
          {selected.map((a_selection) => {
            return (
              <Badge key={a_selection} variant="secondary">
                {recipientsQuery.data.find((r) => r.id === a_selection)?.name}
                <button
                  className="ring-offset-background focus:ring-ring ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(a_selection);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(a_selection)}
                >
                  <X className="text-muted-foreground hover:text-foreground h-3 w-3" />
                </button>
              </Badge>
            );
          })}
          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={t("select_recipients")}
            className={cn(
              "placeholder:text-muted-foreground ml-2 flex-1 bg-transparent outline-none",
              className,
            )}
          />
        </div>
      </div>
      <div className="relative mt-2">
        <CommandList>
          {open && selectables.length > 0 ? (
            <div className="bg-popover text-popover-foreground animate-in absolute top-0 z-10 w-full rounded-md border shadow-md outline-none">
              <CommandGroup className="h-full overflow-auto">
                {selectables.map((a_selection) => {
                  return (
                    <CommandItem
                      key={a_selection}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={(_value) => {
                        setInputValue("");
                        setSelected((prev) => [...prev, a_selection]);
                        onChange?.([...selected, a_selection]);
                      }}
                      className={"cursor-pointer"}
                    >
                      {
                        recipientsQuery.data.find((r) => r.id == a_selection)
                          ?.name
                      }
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </div>
          ) : null}
        </CommandList>
      </div>
    </Command>
  );
}
