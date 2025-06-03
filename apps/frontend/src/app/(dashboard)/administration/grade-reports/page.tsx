import type { Metadata } from "next";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";
import { GradeDistributionChart } from "~/components/administration/grade-reports/GradeDistributionChart";
import { GradeReportGenerator } from "~/components/administration/grade-reports/GradeReportGenerator";
import { GradeTable } from "~/components/administration/grade-reports/GradeTable";
import { RecentGradesTable } from "~/components/administration/grade-reports/RecentGradesTable";
import { StudentPerformanceChart } from "~/components/administration/grade-reports/StudentPerformanceChart";
import { getServerTranslations } from "~/i18n/server";

export const metadata: Metadata = {
  title: "Grades Management Dashboard",
  description:
    "A comprehensive dashboard for managing and analyzing student grades",
};

export default async function Page() {
  const { t } = await getServerTranslations();
  return (
    <div className="px-4 py-2">
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">{t("dashboard")}</TabsTrigger>
          <TabsTrigger value="grades">
            {t("grades")} & {t("reportcards")}
          </TabsTrigger>
          <TabsTrigger value="reports">{t("reports")}</TabsTrigger>
          <TabsTrigger value="analytics">{t("charts")}</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
                <CardDescription>
                  Distribution of grades across all students
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <GradeDistributionChart />
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Recent Grades</CardTitle>
                <CardDescription>
                  Latest grades entered into the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentGradesTable />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Student Performance</CardTitle>
                <CardDescription>
                  Comparison of student performance over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StudentPerformanceChart />
              </CardContent>
            </Card>
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Grade Report Generator</CardTitle>
                <CardDescription>
                  Generate and download grade reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GradeReportGenerator />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="grades" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Grades</CardTitle>
              <CardDescription>
                Comprehensive view of all student grades
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <GradeTable />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Grade Reports</CardTitle>
              <CardDescription>
                Generate and manage grade reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GradeReportGenerator expanded={true} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Grade Analytics</CardTitle>
              <CardDescription>In-depth analysis of grade data</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-4 text-sm font-medium">
                  Grade Distribution by Subject
                </h3>
                <div className="h-[300px]">
                  <GradeDistributionChart bySubject={true} />
                </div>
              </div>
              <div>
                <h3 className="mb-4 text-sm font-medium">Performance Trends</h3>
                <div className="h-[300px]">
                  <StudentPerformanceChart extended={true} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
