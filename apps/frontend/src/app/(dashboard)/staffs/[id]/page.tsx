import { EmptyState } from "~/components/EmptyState";
import { LogActivityTable } from "~/components/LogActivityTable";
import { getServerTranslations } from "~/i18n/server";
import { caller } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const staff = await caller.staff.get(params.id);
  const { t } = await getServerTranslations();
  if (!staff.userId) {
    return <EmptyState className="my-8" title={t("no_data")} />;
  }
  const logs = await caller.logActivity.user(staff.userId);

  return (
    <div className="flex flex-col p-2">
      <LogActivityTable logs={logs} />
    </div>
  );
}
