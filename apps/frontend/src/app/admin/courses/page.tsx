import { getServerTranslations } from "@repo/i18n/server";

import { PageHeader } from "../../(dashboard)/administration/PageHeader";
import { CourseAction } from "./CourseAction";
import { CourseTable } from "./CourseTable";

export default async function Page() {
  const { t } = await getServerTranslations();

  return (
    <div className="flex flex-col gap-2">
      <PageHeader title={t("courses")}>
        <CourseAction />
      </PageHeader>
      <CourseTable />
    </div>
  );
}
