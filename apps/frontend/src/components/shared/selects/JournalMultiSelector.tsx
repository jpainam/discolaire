"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "~/components/ui/combobox";
import { Skeleton } from "~/components/ui/skeleton";
import { useTRPC } from "~/trpc/react";

export function JournalMultiSelector({
  onChangeAction,
  defaultValue,
}: {
  onChangeAction: (values: string[]) => void;
  defaultValue?: string[];
}) {
  const anchor = useComboboxAnchor();
  const t = useTranslations();
  const trpc = useTRPC();
  const journalQuery = useQuery(trpc.accountingJournal.all.queryOptions());
  if (journalQuery.isPending) {
    return <Skeleton className="h-8" />;
  }
  const data = journalQuery.data ?? [];
  const options: string[] = journalQuery.data?.map((c) => c.name) ?? [];
  const defaultValues = data
    .filter((d) => defaultValue?.includes(d.id))
    .map((d) => d.name);
  return (
    <Combobox
      multiple
      autoHighlight
      items={options}
      onValueChange={(values) => {
        onChangeAction(
          data.filter((d) => values.includes(d.name)).map((d) => d.id),
        );
      }}
      defaultValue={defaultValues}
    >
      <ComboboxChips ref={anchor}>
        <ComboboxValue>
          {(values: string[]) => (
            <React.Fragment>
              {values.map((value: string, index: number) => (
                <ComboboxChip key={index}>{value}</ComboboxChip>
              ))}
              <ComboboxChipsInput />
            </React.Fragment>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>{t("no_data")}</ComboboxEmpty>
        <ComboboxList>
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
