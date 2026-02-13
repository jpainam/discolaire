import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { decode } from "entities";
import { useTranslations } from "next-intl";

import { SearchCombobox } from "~/components/SearchCombobox";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";

interface FormerSchoolSelectorProps {
  className?: string;
  defaultValue?: string;
  onChange?: (value: string | null | undefined) => void;
}

export function FormerSchoolSelector({
  className,
  defaultValue,
  onChange,
}: FormerSchoolSelectorProps) {
  const trpc = useTRPC();

  const t = useTranslations();

  const [value, setValue] = useState(defaultValue ?? "");
  const [label, setLabel] = useState("");
  const [search, setSearch] = useState("");
  const formerSchoolsQuery = useQuery(
    trpc.formerSchool.search.queryOptions({
      q: search,
    }),
  );

  return (
    <SearchCombobox
      className={cn("w-full", className)}
      items={
        formerSchoolsQuery.data?.map((sch) => ({
          value: sch.id,
          label: decode(sch.name),
        })) ?? []
      }
      value={value}
      isLoading={formerSchoolsQuery.isLoading}
      label={label}
      onSelect={(value, label) => {
        setValue(value);
        setLabel(label ?? "");
        onChange?.(value);
      }}
      onSearchChange={setSearch}
      searchPlaceholder={t("search") + " ..."}
      noResultsMsg={t("no_results")}
      selectItemMsg={t("select_an_option")}
    />
  );
}
