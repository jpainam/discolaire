"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Label } from "@repo/ui/components/label";

import { SearchCombobox } from "~/components/SearchCombobox";
import { useRouter } from "~/hooks/use-router";
import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";

export function CreateStudentTransaction({
  studentId,
  fullName,
}: {
  studentId: string | null;
  fullName?: string;
}) {
  const { t } = useLocale();
  const trpc = useTRPC();
  const [search, setSearch] = useState("");
  const router = useRouter();

  const studentsQuery = useQuery(
    trpc.student.all.queryOptions({
      query: search,
    }),
  );
  return (
    <div className="flex flex-col items-center justify-center gap-2 p-4">
      <Label>{t("students")}</Label>
      <SearchCombobox
        className="w-full lg:w-1/3"
        items={
          studentsQuery.data?.map((stud) => ({
            value: stud.id,
            label: getFullName(stud),
          })) ?? []
        }
        value={studentId ?? ""}
        label={fullName ?? t("select_an_option")}
        onSelect={(value, label) => {
          router.push(
            `/administration/accounting/create?studentId=${value}&label=${label}`,
          );
        }}
        onSearchChange={setSearch}
        searchPlaceholder={t("search") + " ..."}
        noResultsMsg={t("no_results")}
        selectItemMsg={t("select_an_option")}
      />
    </div>
  );
}
