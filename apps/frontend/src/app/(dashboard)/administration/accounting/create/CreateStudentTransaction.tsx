"use client";

import { Label } from "@repo/ui/components/label";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import z from "zod";
import { SearchCombobox } from "~/components/SearchCombobox";
import { useRouter } from "~/hooks/use-router";
import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";

const schema = z.object({
  studentId: z.string().min(1),
  transactionType: z.enum(["DISCOUNT", "CREDIT", "DEBIT"]),
});
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
  const [value, setValue] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const studentsQuery = useQuery(
    trpc.student.search.queryOptions({
      query: search,
    })
  );
  return (
    <div className="flex flex-col p-4 gap-2 justify-center items-center">
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
          setValue(value);
          router.push(`/administration/accounting/create?studentId=${value}`);
        }}
        onSearchChange={setSearch}
        searchPlaceholder={t("search") + " ..."}
        noResultsMsg={t("no_results")}
        selectItemMsg={t("select_an_option")}
      />
    </div>
  );
}
