"use client";

import { useEffect } from "react";
import { useSetAtom } from "jotai";

import { useLocale } from "~/i18n";
import { breadcrumbAtom } from "~/lib/atoms";

export function UpdateAdminBreadcrumb() {
  const { t } = useLocale();
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
