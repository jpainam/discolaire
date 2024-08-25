import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { useAtom } from "jotai";

import { peopleCriteriaAtom } from "~/atoms/use-criteria";
import { useLocale } from "~/hooks/use-locale";

export function SearchFieldSelector() {
  const { t } = useLocale();
  const selectCriteriaOptions = [
    { label: t("all_criteria"), value: "all" },
    { label: t("lastName"), value: "nom" },
    { label: t("firstName"), value: "prenom" },
    { label: t("registration"), value: "matricule" },
    { label: t("level"), value: "level" },
    { label: t("gender"), value: "gender" },
    { label: t("dateOfBirth"), value: "dob" },
  ];
  const [criteria, setCriteria] = useAtom(peopleCriteriaAtom);

  return (
    <Select
      onValueChange={(val) => {
        setCriteria((prev) => ({ ...prev, field: val }));
      }}
      defaultValue={criteria.field}
    >
      <SelectTrigger className="h-8 w-[250px]">
        <SelectValue placeholder={t("criteria")} />
      </SelectTrigger>
      <SelectContent>
        {selectCriteriaOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
