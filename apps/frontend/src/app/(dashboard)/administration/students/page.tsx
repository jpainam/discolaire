import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";
import { ChartSpline, SquareArrowLeft, Upload, Users } from "lucide-react";
import { StudentDataTable } from "~/components/students/StudentDataTable";
import { getServerTranslations } from "~/i18n/server";
import { api } from "~/trpc/server";
import { StudentPageHeader } from "../../students/StudentPageHeader";

export default async function Page() {
  const { t } = await getServerTranslations();
  const students = await api.student.lastAccessed({ limit: 50 });
  return (
    <Tabs defaultValue="tab-1">
      <TabsList className="h-auto justify-start w-full rounded-none border-b bg-transparent p-0">
        <TabsTrigger
          value="tab-1"
          className="data-[state=active]:after:bg-primary relative flex-col rounded-none px-4 py-2 text-xs after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          <Users className="mb-1.5 opacity-60" size={16} aria-hidden="true" />
          {t("students")}
        </TabsTrigger>
        <TabsTrigger
          value="tab-2"
          className="data-[state=active]:after:bg-primary relative flex-col rounded-none px-4 py-2 text-xs after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          <SquareArrowLeft
            className="mb-1.5 opacity-60"
            size={16}
            aria-hidden="true"
          />
          {t("excluded")}
        </TabsTrigger>
        <TabsTrigger
          value="tab-3"
          className="data-[state=active]:after:bg-primary relative flex-col rounded-none px-4 py-2 text-xs after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          <Upload className="mb-1.5 opacity-60" size={16} aria-hidden="true" />
          {t("import")}
        </TabsTrigger>
        <TabsTrigger
          value="tab-4"
          className="data-[state=active]:after:bg-primary relative flex-col rounded-none px-4 py-2 text-xs after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          <ChartSpline
            className="mb-1.5 opacity-60"
            size={16}
            aria-hidden="true"
          />
          {t("statistics")}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="tab-1">
        <div className="flex flex-col gap-2">
          <StudentPageHeader />
          <StudentDataTable students={students} />
        </div>
      </TabsContent>
      <TabsContent value="tab-2">
        <p className="text-muted-foreground p-4 text-center text-xs">
          Content for Tab 2
        </p>
      </TabsContent>
      <TabsContent value="tab-3">
        <p className="text-muted-foreground p-4 text-center text-xs">
          Content for Tab 3
        </p>
      </TabsContent>
      <TabsContent value="tab-4">
        <p className="text-muted-foreground p-4 text-center text-xs">
          Content for Tab 3
        </p>
      </TabsContent>
    </Tabs>
  );
}
