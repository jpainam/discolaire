"use client";

import { Input } from "@repo/ui/input";
import { useAtom } from "jotai";

import { peopleCriteriaAtom } from "~/atoms/use-criteria";
import { useLocale } from "~/hooks/use-locale";

export function SearchInputField() {
  const [criteria, setCriteria] = useAtom(peopleCriteriaAtom);
  const { t } = useLocale();
  return (
    <div className="w-2/3">
      <Input
        className="h-8"
        defaultValue={criteria.query}
        placeholder={`${t("search_by")} ${t(criteria.field)}`}
        onChange={(val) => {
          setCriteria((prev) => ({ ...prev, query: val.target.value }));
        }}
        type="text"
      />
    </div>
  );
}
