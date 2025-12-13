import {
  BoxIcon,
  CircleUserRound,
  ImportIcon,
  PanelsTopLeftIcon,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Badge } from "~/components/ui/badge";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { caller } from "~/trpc/server";
import { EnrolledStudentDataTable } from "./EnrolledStudentDataTable";
import { ExcludedStudentDataTable } from "./excluded/ExcludedStudentDataTable";
import { ImportStudentContainer } from "./import/ImportStudentContainer";

export default async function Page() {
  const t = await getTranslations();
  const enrolled = await caller.enrollment.all({ limit: 10000 });
  const newStudents = enrolled.filter((std) => std.isNew);
  const excluded = await caller.student.excluded();
  return (
    <Tabs defaultValue="tab-1">
      <ScrollArea className="px-4">
        <TabsList className="">
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
              {excluded.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="tab-4" className="group">
            <ImportIcon
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            Export/Import
          </TabsTrigger>
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <TabsContent value="tab-1">
        <EnrolledStudentDataTable newStudent={false} students={enrolled} />
      </TabsContent>
      <TabsContent value="tab-2">
        <EnrolledStudentDataTable newStudent={true} students={newStudents} />
      </TabsContent>
      <TabsContent value="tab-3">
        <ExcludedStudentDataTable students={excluded} />
      </TabsContent>
      <TabsContent value="tab-4" className="h-full w-full px-6">
        <ImportStudentContainer />
      </TabsContent>
    </Tabs>
  );
}
