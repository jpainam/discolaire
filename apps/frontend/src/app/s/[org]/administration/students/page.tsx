import { BoxIcon, CircleUserRound, PanelsTopLeftIcon } from "lucide-react";

import { Badge } from "@repo/ui/components/badge";
import { ScrollArea, ScrollBar } from "@repo/ui/components/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";
import { getServerTranslations } from "~/i18n/server";
import { caller } from "~/trpc/server";
import { EnrolledStudentDataTable } from "./EnrolledStudentDataTable";

export default async function Page() {
  const { t } = await getServerTranslations();
  const enrolled = await caller.enrollment.enrolled({});
  const newStudents = enrolled.filter((std) => std.enrollments.length === 1);
  return (
    <Tabs defaultValue="tab-1">
      <ScrollArea>
        <TabsList>
          <TabsTrigger value="tab-1">
            <CircleUserRound
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            {t("Registered")}
            <Badge
              className="bg-primary/15 ms-1.5 min-w-5 px-1 transition-opacity group-data-[state=inactive]:opacity-50"
              variant="secondary"
            >
              {enrolled.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="tab-2" className="group">
            <PanelsTopLeftIcon
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            {t("New Students")}
            <Badge
              className="bg-primary/15 ms-1.5 min-w-5 px-1 transition-opacity group-data-[state=inactive]:opacity-50"
              variant="secondary"
            >
              {newStudents.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="tab-3" className="group">
            <BoxIcon
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            {t("Excluded students")}
            <Badge
              className="bg-primary/15 ms-1.5 min-w-5 px-1 transition-opacity group-data-[state=inactive]:opacity-50"
              variant="secondary"
            >
              3
            </Badge>
          </TabsTrigger>
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <TabsContent value="tab-1">
        <EnrolledStudentDataTable students={enrolled} />
      </TabsContent>
      <TabsContent value="tab-2">
        <EnrolledStudentDataTable students={newStudents} />
      </TabsContent>
      <TabsContent value="tab-3">
        <p className="text-muted-foreground p-4 pt-1 text-center text-xs">
          Content for Tab 3
        </p>
      </TabsContent>
    </Tabs>
  );
}
