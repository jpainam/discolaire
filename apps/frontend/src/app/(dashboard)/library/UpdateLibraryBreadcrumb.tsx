"use client";

import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { useLocale } from "~/i18n";
import { breadcrumbAtom } from "~/lib/atoms";

export function UpdateLibraryBreadcrumb() {
  const { t } = useLocale();
  const setBreadcrumbs = useSetAtom(breadcrumbAtom);
  useEffect(() => {
    const breads = [
      { name: t("home"), url: "/" },
      { name: t("library"), url: "/library" },
    ];
    setBreadcrumbs(breads);
  }, [setBreadcrumbs, t]);
  return <></>;
}
