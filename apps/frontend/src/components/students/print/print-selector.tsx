"use client";

import { useState } from "react";
//import { toast } from "@repo/ui/components/use-toast";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { useFormContext } from "react-hook-form";

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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/popover";
import { ScrollArea } from "@repo/ui/components/scroll-area";

import { cn } from "~/lib/utils";

interface StudentPrintOption {
  label: string;
  value: string;
  id: number;
}
const studentPrintOptions: StudentPrintOption[] = [
  { id: 1, label: "Fiche d'information de l'eleve", value: "print" },
  { id: 2, label: "Fiche de demande d'inscription", value: "print-export" },
  { id: 3, label: "Certificat de scolarité", value: "certificat" },
  { id: 4, label: "Carte didentité scolaire", value: "cni" },
  { id: 5, label: "Raport financier", value: "financier" },
  { label: "Fiche de présence", value: "presence", id: 6 },
  {
    label: "Fiche de note",
    value: "note",
    id: 7,
  },
  {
    label: "Fiche de discipline",
    value: "discipline",
    id: 8,
  },
  {
    label: "Fiche de santé",
    value: "sante",
    id: 9,
  },
  {
    label: "Fiche de bourse",
    value: "bourse",
    id: 10,
  },
  {
    label: "Fiche de transport",
    value: "transport",
    id: 11,
  },
  {
    label: "Fiche de cantine",
    value: "cantine",
    id: 12,
  },
  {
    label: "Fiche de bibliothèque",
    value: "bibliotheque",
    id: 13,
  },
  {
    label: "Fiche de sport",
    value: "sport",
    id: 14,
  },
  {
    label: "Fiche de culture",
    value: "culture",
    id: 15,
  },
  {
    label: "Fiche de sortie",
    value: "sortie",
    id: 16,
  },
  {
    label: "Fiche de visite médicale",
    value: "visit",
    id: 17,
  },
];

export default function PrintSelector({ className }: { className?: string }) {
  const form = useFormContext();

  const [open, setOpen] = useState(false);
  return (
    <>
      <FormField
        control={form.control}
        name="print"
        render={({ field }) => (
          <FormItem className={cn(className)}>
            <FormLabel>Quel rapport imprimé ?</FormLabel>
            <FormControl>
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
                <PopoverContent
                  //
                  className="w-full p-0"
                >
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
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
