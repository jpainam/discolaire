"use client";

import { useAtom } from "jotai";

import { useLocale } from "@repo/i18n";
import { Input } from "@repo/ui/input";

import { peopleCriteriaAtom } from "~/atoms/use-criteria";

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
