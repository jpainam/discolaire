import { Label } from "@repo/ui/components/label";
import { getServerTranslations } from "~/i18n/server";
import { prefetch, trpc } from "~/trpc/server";
import { CourseAction } from "./CourseAction";
import { CourseDataTable } from "./CourseDataTable";

export default async function Page() {
  const { t } = await getServerTranslations();
  prefetch(trpc.course.all.queryOptions());
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 flex-row border-b px-4 py-1">
        <Label>{t("courses")}</Label>
        <div className="ml-auto">
          <CourseAction />
        </div>
      </div>
      <CourseDataTable />
    </div>
  );
}
