import { getTranslations } from "next-intl/server";

import { EmptyComponent } from "~/components/EmptyComponent";
import { LogActivityTable } from "~/components/LogActivityTable";
import { caller } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const activities = await caller.logActivity.user(params.id);
  const t = await getTranslations();
  if (activities.length === 0) {
    return <EmptyComponent title={t("no_data")} />;
  }
  return <LogActivityTable logs={activities} />;
}
