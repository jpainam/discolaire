import { Card, CardContent, CardFooter, CardHeader } from "@repo/ui/card";

import { getServerTranslations } from "~/app/i18n/server";
import { StudentReportFooter } from "~/components/reports/StudentReportFooter";
import { StudentLinkReports } from "~/components/reports/StudentReports";
import { StudentReportToolbar } from "~/components/reports/StudentReportToolbar";

export default async function Page() {
  const { t } = await getServerTranslations();
  //const reports = await getReportsByCategory("student");
  // if (!reports) {
  //   notFound();
  // }
  return (
    <Card>
      <CardHeader className="flex w-full flex-row items-center gap-4 border-b bg-muted/40 py-2">
        <StudentReportToolbar />
      </CardHeader>
      <CardContent className="p-2 md:p-4">
        <StudentLinkReports reports={[]} />
      </CardContent>
      <CardFooter className="flex flex-row justify-end gap-4 border-t py-2">
        <StudentReportFooter />
      </CardFooter>
    </Card>
  );
}
