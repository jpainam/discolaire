import { getServerTranslations } from "@repo/i18n/server";
import { EmptyState } from "@repo/ui/EmptyState";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const { t } = await getServerTranslations();
  return <EmptyState className="mb-10" />;
}
