import { getServerTranslations } from "@/app/i18n/server";
import { EmptyState } from "@/components/EmptyState";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const { t } = await getServerTranslations();
  return <EmptyState className="mb-10" />;
}
