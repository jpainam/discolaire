import { getServerTranslations } from "@/app/i18n/server";
import React from "react";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = await getServerTranslations();
  return <div className="min-h-[60vh]">{children}</div>;
}
