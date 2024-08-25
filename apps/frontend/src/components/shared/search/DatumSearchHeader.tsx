"use client";

import { useCallback } from "react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useAtomValue } from "jotai";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";

import { peopleCriteriaAtom } from "~/atoms/use-criteria";
import AlphabetSearchBlock from "~/components/shared/search/AlphabetSearchBlock";
import { routes } from "~/configs/routes";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useRouter } from "~/hooks/use-router";
import { SearchFieldSelector } from "./SearchFieldSelector";
import { SearchInputField } from "./SearchInputField";
import { TargetSelector } from "./TargetSelector";

export default function DatumSearchHeader() {
  const { t } = useLocale();
  const router = useRouter();
  const { createQueryString } = useCreateQueryString();
  const criteria = useAtomValue(peopleCriteriaAtom);
  const navigateToSearch = useCallback(() => {
    const url = routes.datum.index + "/?" + createQueryString(criteria);
    router.push(url);
  }, [createQueryString, criteria, router]);
  return (
    <div className="mt-2 flex flex-col gap-1.5">
      <p className="text-lg font-semibold leading-none tracking-tight">
        {t("quick_search")}
      </p>
      <p className="text-sm text-muted-foreground">
        Composer de critères de recherche variée pour de bon résultat, lire la
        rubrique d&apos;aide.
      </p>
      <div className="flex w-2/3 gap-2">
        <TargetSelector />
        <SearchFieldSelector />
        <SearchInputField />
        <Button onClick={navigateToSearch}>
          <MagnifyingGlassIcon className="mr-2 h-5 w-5" /> {t("search")}
        </Button>
      </div>
      <AlphabetSearchBlock />
    </div>
  );
}
