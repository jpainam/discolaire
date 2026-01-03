"use client";

import { Fragment, useState } from "react";
import { MagicWand01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { EmptyComponent } from "~/components/EmptyComponent";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "~/components/ui/command";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "~/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { useTRPC } from "~/trpc/react";

export function AppreciationSelector({
  onSelectAction,
}: {
  onSelectAction: ({ id, content }: { id: number; content: string }) => void;
}) {
  const [open, setOpen] = useState(false);
  const trpc = useTRPC();
  const appreciationQuery = useQuery(
    trpc.appreciation.categories.queryOptions(),
  );
  const [filters, setFilters] = useState<string[]>([]);

  const categories = appreciationQuery.data;
  const t = useTranslations();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className="opacity-0 transition-opacity group-hover/row-council:opacity-100"
          size={"icon"}
          variant={"secondary"}
        >
          <HugeiconsIcon icon={MagicWand01Icon} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 md:min-w-2xl" side="bottom" align="end">
        <Command
          filter={(value, search) => {
            const appreciations = categories?.flatMap(
              (cat) => cat.appreciations,
            );
            const item = appreciations?.find((ap) => ap.id.toString() == value);
            if (item?.content.toLowerCase().includes(search.toLowerCase()))
              return 1;
            return 0;
          }}
          className="p-0"
        >
          <CommandInput placeholder={t("search")} />
          <FieldGroup className="flex flex-row flex-wrap gap-2 p-2">
            {categories?.map((cat) => (
              <FieldLabel
                htmlFor={cat.id.toString()}
                key={cat.id}
                className="!w-fit"
              >
                <Field
                  orientation="horizontal"
                  className="gap-1.5 overflow-hidden !px-3 !py-1.5 transition-all duration-100 ease-linear group-has-data-[state=checked]/field-label:!px-2"
                >
                  <Checkbox
                    id={cat.id.toString()}
                    checked={filters.includes(cat.id.toString())}
                    onCheckedChange={(checked) => {
                      if (!checked) {
                        setFilters((w) =>
                          w.filter((catId) => catId !== cat.id.toString()),
                        );
                      } else {
                        setFilters((w) => [...w, cat.id.toString()]);
                      }
                    }}
                    className="-ml-6 -translate-x-1 rounded-full transition-all duration-100 ease-linear data-[state=checked]:ml-0 data-[state=checked]:translate-x-0"
                  />
                  <FieldTitle className="text-xs">{cat.name}</FieldTitle>
                </Field>
              </FieldLabel>
            ))}
          </FieldGroup>
          <CommandSeparator />
          <CommandList className="min-h-72">
            <CommandEmpty>
              <EmptyComponent />
            </CommandEmpty>

            {(filters.length > 0
              ? categories?.filter((c) => filters.includes(String(c.id)))
              : categories
            )?.map((category, index) => {
              return (
                <Fragment key={index}>
                  <CommandGroup heading={category.name}>
                    {category.appreciations.map((item, idx) => {
                      return (
                        <CommandItem
                          key={`${idx}-${index}`}
                          value={item.id.toString()}
                          onSelect={(_value) => {
                            onSelectAction({
                              id: item.id,
                              content: item.content,
                            });

                            setOpen(false);
                          }}
                        >
                          <span className="text-xs">{item.content}</span>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                  <CommandSeparator />
                </Fragment>
              );
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
