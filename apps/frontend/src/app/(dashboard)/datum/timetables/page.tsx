import { getServerTranslations } from "@repo/i18n/server";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@repo/ui/components/breadcrumb";
import { Separator } from "@repo/ui/components/separator";

import { Timetable } from "./Timetable";

export default async function Page() {
  const d = new Date();
  const { i18n } = await getServerTranslations();
  return (
    <>
      <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="capitalize">
                {d.toLocaleDateString(i18n.language, {
                  month: "long",
                  year: "numeric",
                })}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="gap- flex flex-1 flex-col">
        <Timetable />
      </div>
    </>
  );
}
