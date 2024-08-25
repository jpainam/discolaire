import React from "react";

import { getServerTranslations } from "@repo/i18n/server";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = await getServerTranslations();
  return <div className="min-h-[60vh]">{children}</div>;
}
