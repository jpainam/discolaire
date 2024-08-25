"use client";

import { useState } from "react";
//import { toast } from "@repo/ui/use-toast";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { Button } from "@repo/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@repo/ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover";
import { ScrollArea } from "@repo/ui/scroll-area";
import { useFormContext } from "react-hook-form";

import { useLocale } from "~/hooks/use-locale";
import { cn } from "~/lib/utils";
import { studentPrintOptions } from "./print-selector-old";

export default function PrintSelector({ className }: { className?: string }) {
  const form = useFormContext();
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  return (
    <>
      <FormLabel>Quel rapport imprimé ?</FormLabel>
      <FormField
        control={form.control}
        name="print"
        render={({ field }) => (
          <FormItem className={cn(className)}>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full flex-1 justify-between",
                      !field.value && "text-muted-foreground",
                    )}
                  >
                    {field.value
                      ? studentPrintOptions.find(
                          (print) => print.value === field.value,
                        )?.label
                      : "Choisir le document à imprimer"}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent sameWidthAsTrigger={true} className="w-full p-0">
                <Command>
                  <CommandList>
                    <CommandInput placeholder="Rechercher une impression..." />
                    <CommandEmpty>Aucune impression trouvée.</CommandEmpty>
                    <CommandGroup>
                      <ScrollArea className="h-[300px]">
                        {studentPrintOptions.map((print) => (
                          <CommandItem
                            value={print.value}
                            key={print.value}
                            onSelect={() => {
                              form.setValue("print", print.value);
                              setOpen(false);
                            }}
                          >
                            <CheckIcon
                              className={cn(
                                "mr-2 h-4 w-4",
                                print.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {print.label}
                          </CommandItem>
                        ))}
                      </ScrollArea>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
