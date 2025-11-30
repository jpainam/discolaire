"use client";

import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { useTranslations } from "next-intl";

import { breadcrumbAtom } from "~/lib/atoms";

export function UpdateLibraryBreadcrumb() {
  const t = useTranslations();
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
