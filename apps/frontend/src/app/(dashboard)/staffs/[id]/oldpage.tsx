import { getTranslations } from "next-intl/server";

import { EmptyComponent } from "~/components/EmptyComponent";
import { LogActivityTable } from "~/components/LogActivityTable";
import { caller } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const staff = await caller.staff.get(params.id);
  const t = await getTranslations();
  if (!staff.userId) {
    return <EmptyComponent title={t("no_data")} />;
  }
  const logs = await caller.logActivity.user(staff.userId);

  return (
    <div className="flex flex-col p-2">
      <LogActivityTable logs={logs} />
      {/* <ShortCalendar /> */}
    </div>
  );
}
