import { EmptyState } from "~/components/EmptyState";
import { LogActivityTable } from "~/components/LogActivityTable";
import { getServerTranslations } from "~/i18n/server";
import { caller } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const activities = await caller.logActivity.user(params.id);
  const { t } = await getServerTranslations();
  if (activities.length === 0) {
    return <EmptyState className="my-8" title={t("no_data")} />;
  }
  return <LogActivityTable logs={activities} />;
}
