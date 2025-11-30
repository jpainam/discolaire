"use client";

import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { useTranslations } from "next-intl";

import { breadcrumbAtom } from "~/lib/atoms";

export function UpdateAdminBreadcrumb() {
  const t = useTranslations();
  const setBreadcrumbs = useSetAtom(breadcrumbAtom);
  // then later add the sub-breadcrumbs for navigating admin
  useEffect(() => {
    const breads = [
      { name: t("home"), url: "/" },
      { name: t("administration"), url: "/administration" },
    ];
    setBreadcrumbs(breads);
  }, [setBreadcrumbs, t]);
  return <></>;
}
