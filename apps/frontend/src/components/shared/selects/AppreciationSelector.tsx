"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

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
import { useTRPC } from "~/trpc/react";

export function AppreciationSelector() {
  const [open, setOpen] = useState(false);
  const trpc = useTRPC();
  const appreciationQuery = useQuery(
    trpc.appreciation.categories.queryOptions(),
  );

  const categories = appreciationQuery.data;

  return (
    <div className="flex items-center space-x-4">
      <p className="text-muted-foreground text-sm">Status</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline">Select</Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" side="bottom" align="start">
          <Command>
            <CommandInput placeholder="Change status..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {categories?.map((category, index) => {
                  return (
                    <CommandGroup heading={category.name}>
                      {category.appreciations.map((item, idx) => {
                        return (
                          <CommandItem
                            key={`${idx}-${index}`}
                            value={item.id.toString()}
                            onSelect={(_value) => {
                              //onSelectAction?.(cat?.id.toString());
                              //onSelectContent?.(item.content);
                              setOpen(false);
                            }}
                          >
                            {item.content}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
