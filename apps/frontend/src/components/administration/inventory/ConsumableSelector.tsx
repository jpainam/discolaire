"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { cn } from "@repo/ui/lib/utils";

import { useTRPC } from "~/trpc/react";

interface SelectorProps {
  defaultValue?: string;
  onChange?: (value: string | null | undefined) => void;
  className?: string;
}

export function ConsumableSelector({
  defaultValue,
  onChange,
  className,
}: SelectorProps) {
  const t = useTranslations();
  const trpc = useTRPC();
  const { data: inventory } = useSuspenseQuery(
    trpc.inventory.consumables.queryOptions(),
  );

  return (
    <Select
      onValueChange={(val) => {
        onChange?.(val);
      }}
      defaultValue={defaultValue}
    >
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue placeholder={t("consumable")} />
      </SelectTrigger>
      <SelectContent>
        {inventory.map((item) => (
          <SelectItem key={item.id} value={item.id}>
            <span>{item.name}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  // return (
  //   <Popover open={open} onOpenChange={setOpen} modal={false}>
  //     <PopoverTrigger asChild>
  //       <Button
  //         variant="outline"
  //         role="combobox"
  //         aria-expanded={open}
  //         className={"w-full justify-between"}
  //       >
  //         {inventory.find((it) => it.id === value)?.name ??
  //           t("select_an_option")}{" "}
  //         <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 justify-end opacity-50" />
  //       </Button>
  //     </PopoverTrigger>
  //     <PopoverContent
  //       style={{ width: "var(--radix-popover-trigger-width)" }}
  //       className="p-0"
  //       side="bottom"
  //       align="start"
  //     >
  //       <Command
  //         //className="rounded-lg border shadow-md"
  //         filter={(value, search) => {
  //           const item = inventory.find((it) => it.id === value);
  //           if (item?.name.toLowerCase().includes(search.toLowerCase())) {
  //             return 1;
  //           }
  //           return 0;
  //         }}
  //       >
  //         <CommandInput placeholder={t("search_for_an_option")} />
  //         <CommandList className="max-h-[300px] overflow-y-auto">
  //           <CommandEmpty>{t("select_an_option")}</CommandEmpty>
  //           <CommandGroup>
  //             {inventory.map((item) => (
  //               <CommandItem
  //                 key={item.id}
  //                 className="flex w-full cursor-pointer items-center justify-between space-x-2"
  //                 value={item.id}
  //                 onSelect={(currentValue) => {
  //                   onChange?.(currentValue == value ? null : currentValue);
  //                   setValue(currentValue === value ? "" : currentValue);
  //                   setOpen(false);
  //                 }}
  //               >
  //                 <span>{item.name}</span>
  //                 {value === item.id && (
  //                   <Check className="text-brand" strokeWidth={2} size={16} />
  //                 )}
  //               </CommandItem>
  //             ))}
  //           </CommandGroup>
  //         </CommandList>
  //       </Command>
  //     </PopoverContent>
  //   </Popover>
  // );
}
