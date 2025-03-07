import { Label } from "@repo/ui/components/label";
import { getServerTranslations } from "~/i18n/server";
import { CourseAction } from "./CourseAction";
import { CourseTable } from "./CourseTable";

export default async function Page() {
  const { t } = await getServerTranslations();
  return (
    <div className="flex flex-col gap-2 px-4 py-2">
      <div className="flex items-center gap-2 flex-row">
        <Label>{t("courses")}</Label>
        <div className="ml-auto">
          <CourseAction />
        </div>
      </div>
      <CourseTable />
    </div>
  );
}
