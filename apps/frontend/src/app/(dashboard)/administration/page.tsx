import { getServerTranslations } from "~/i18n/server";

import { ClassroomStatistics } from "~/components/administration/ClassroomStatistics";
import { Effectif } from "~/components/administration/Effectif";
import { RecentActivities } from "~/components/administration/RecentActivities";

export default async function Page() {
  const { t } = await getServerTranslations();
  return (
    <div className="grid p-4 flex-col gap-2">
      <Effectif />
      <div className="grid grid-cols-1 gap-2 px-2 xl:grid-cols-12">
        <ClassroomStatistics className="col-span-5" />
        <RecentActivities />
      </div>
    </div>
  );
}
