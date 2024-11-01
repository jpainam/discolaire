import { getServerTranslations } from "@repo/i18n/server";

import { ClassroomStatistics } from "~/components/administration/ClassroomStatistics";
import { PageHeader } from "./PageHeader";

export default async function Page() {
  const { t } = await getServerTranslations();
  return (
    <div className="flex flex-col gap-2">
      <PageHeader title={t("administration")}></PageHeader>
      <div className="grid grid-cols-1 gap-2 px-2 xl:grid-cols-12">
        <ClassroomStatistics className="col-span-5" />
      </div>
    </div>
  );
}
