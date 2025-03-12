import { cn } from "@repo/ui/lib/utils";
import { useState } from "react";
import { SearchCombobox } from "~/components/SearchCombobox";
import { useLocale } from "~/i18n";
import { api } from "~/trpc/react";
import { getFullName } from "~/utils/full-name";

export function UserSelector({
  className,
  defaultValue,
  onChange,
}: {
  className?: string;
  defaultValue?: string;
  onChange: (value: string | undefined) => void;
}) {
  const { t } = useLocale();
  const [value, setValue] = useState<string>(defaultValue ?? "");
  const [label, setLabel] = useState(t("search_a_user"));
  const [search, setSearch] = useState("");
  const usersQuery = api.user.search.useQuery({
    query: search,
  });

  return (
    <SearchCombobox
      className={cn("w-full", className)}
      items={
        usersQuery.data?.map((stud) => ({
          value: stud.id,
          label: getFullName(stud),
        })) ?? []
      }
      value={value}
      label={label}
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
