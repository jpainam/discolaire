import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { decode } from "entities";
import { useTranslations } from "next-intl";

import { cn } from "@repo/ui/lib/utils";

import { SearchCombobox } from "~/components/SearchCombobox";
import { useTRPC } from "~/trpc/react";

export function UserSelector({
  className,
  defaultValue,
  disabled = false,
  onChange,
}: {
  className?: string;
  disabled?: boolean;
  defaultValue?: string;
  onChange: (value: string | undefined) => void;
}) {
  const t = useTranslations();
  const [value, setValue] = useState<string>(defaultValue ?? "");
  const [label, setLabel] = useState(t("search_a_user"));
  const [search, setSearch] = useState("");
  const trpc = useTRPC();
  const usersQuery = useQuery(
    trpc.user.search.queryOptions({
      query: search,
    }),
  );

  return (
    <SearchCombobox
      className={cn("w-full", className)}
      items={
        usersQuery.data?.map((user) => ({
          value: user.id,
          label: user.name,
        })) ?? []
      }
      disabled={disabled}
      value={value}
      label={decode(label)}
      onSelect={(value, label) => {
        setValue(value);
        setLabel(label ?? "");
        onChange(value);
      }}
      onSearchChange={setSearch}
      searchPlaceholder={t("search") + " ..."}
      noResultsMsg={t("no_results")}
      selectItemMsg={t("select_an_option")}
    />
  );
}
