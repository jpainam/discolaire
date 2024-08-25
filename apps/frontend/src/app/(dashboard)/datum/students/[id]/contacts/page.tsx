import { EmptyState } from "@repo/ui/EmptyState";

import { getServerTranslations } from "~/app/i18n/server";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const { t } = await getServerTranslations();
  return <EmptyState className="mb-10" />;
}
