"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import type { PopoverProps } from "@radix-ui/react-popover";
import { Button } from "@repo/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@repo/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover";

import { cn } from "~/lib/utils";

interface PrintSelectorProps extends PopoverProps {
  stutentPrints: StudentPrintOption[];
}

export function StudentPrintSelector({
  stutentPrints,
  ...props
}: PrintSelectorProps) {
  const [open, setOpen] = useState(false);
  const [selectedPrint, setSelectedPrint] = useState<StudentPrintOption>();
  const router = useRouter();

  return (
    <Popover open={open} onOpenChange={setOpen} {...props}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-label="Choisir le document à imprimer..."
          aria-expanded={open}
          className="w-full flex-1 justify-between"
        >
          {selectedPrint
            ? selectedPrint.label
            : "Choisir le document à imprimer..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-0">
        <Command>
          <CommandInput placeholder="Rechercher une impression..." />
          <CommandEmpty>Aucune impression trouvée.</CommandEmpty>
          <CommandGroup heading="Impressions rapides">
            {stutentPrints.map((print) => (
              <CommandItem
                key={print.id}
                onSelect={() => {
                  setSelectedPrint(print);
                  setOpen(false);
                }}
              >
                {print.label}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    selectedPrint?.id === print.id
                      ? "opacity-100"
                      : "opacity-0",
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup className="pt-0">
            <CommandItem onSelect={() => router.push("/examples")}>
              Autres type d&apos;impression
            </CommandItem>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

interface StudentPrintOption {
  label: string;
  value: string;
  id: number;
}
export const studentPrintOptions: StudentPrintOption[] = [
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
