import { Label } from "@repo/ui/components/label";
import { getServerTranslations } from "~/i18n/server";

import { ClassroomStatistics } from "~/components/administration/ClassroomStatistics";
import { Effectif } from "~/components/administration/Effectif";
import { RecentActivities } from "~/components/administration/RecentActivities";

export default async function Page() {
  const { t } = await getServerTranslations();
  return (
    <div className="flex flex-col gap-2">
      <Label> {t("administration")}</Label>
      <Effectif />
      <div className="grid grid-cols-1 gap-2 px-2 xl:grid-cols-12">
        <ClassroomStatistics className="col-span-5" />
        <RecentActivities />
      </div>
    </div>
  );
}
