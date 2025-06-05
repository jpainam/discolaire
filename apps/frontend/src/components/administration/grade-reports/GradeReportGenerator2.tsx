"use client";

import { Download, FileText, Printer } from "lucide-react";
import { useState } from "react";

import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import { Checkbox } from "@repo/ui/components/checkbox";
import { Label } from "@repo/ui/components/label";
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/radio-group";
import { Separator } from "@repo/ui/components/separator";
import { ClassroomSelector } from "~/components/shared/selects/ClassroomSelector";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { useLocale } from "~/i18n";

const reportTypes = [
  { id: "individual", label: "Individual Student Report" },
  { id: "class", label: "Class Summary Report" },
  { id: "progress", label: "Progress Report" },
  { id: "final", label: "Final Grade Report" },
];

interface GradeReportGeneratorProps {
  expanded?: boolean;
}

export function GradeReportGenerator2({
  expanded = false,
}: GradeReportGeneratorProps) {
  const [selectedClass, setSelectedClass] = useState("");
  const [reportType, setReportType] = useState("individual");
  const [includeOptions, setIncludeOptions] = useState({
    comments: true,
    attendance: true,
    charts: true,
    comparison: false,
  });
  const { t } = useLocale();

  const handleGenerateReport = () => {
    // In a real app, this would generate and download the report
    console.log("Generating report with:", {
      class: selectedClass,
      reportType,
      includeOptions,
    });
    // Show success message or download the report
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex flex-col gap-4">
          <div className="grid xl:grid-cols-2 gap-2">
            <div className="grid gap-2">
              <Label>Select Class</Label>
              <ClassroomSelector
                onChange={(val) => {
                  setSelectedClass(val ?? "");
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label>Select Class</Label>
              <TermSelector />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Report Type</Label>
            <RadioGroup
              defaultValue="individual"
              value={reportType}
              onValueChange={setReportType}
              className={expanded ? "grid grid-cols-2 gap-2" : "space-y-1"}
            >
              {reportTypes.map((type) => (
                <div key={type.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={type.id} id={type.id} />
                  <Label htmlFor={type.id}>{type.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {expanded && (
            <div className="grid gap-2">
              <Label>Include in Report</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="comments"
                    checked={includeOptions.comments}
                    onCheckedChange={(checked) =>
                      setIncludeOptions({
                        ...includeOptions,
                        comments: !!checked,
                      })
                    }
                  />
                  <Label htmlFor="comments">Teacher Comments</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="attendance"
                    checked={includeOptions.attendance}
                    onCheckedChange={(checked) =>
                      setIncludeOptions({
                        ...includeOptions,
                        attendance: !!checked,
                      })
                    }
                  />
                  <Label htmlFor="attendance">Attendance Records</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="charts"
                    checked={includeOptions.charts}
                    onCheckedChange={(checked) =>
                      setIncludeOptions({
                        ...includeOptions,
                        charts: !!checked,
                      })
                    }
                  />
                  <Label htmlFor="charts">Performance Charts</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="comparison"
                    checked={includeOptions.comparison}
                    onCheckedChange={(checked) =>
                      setIncludeOptions({
                        ...includeOptions,
                        comparison: !!checked,
                      })
                    }
                  />
                  <Label htmlFor="comparison">Class Comparison</Label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {expanded ? (
        <div className="space-y-4">
          <Separator />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium">
                      Last Generated Report
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Mathematics 101 - Class Summary (Sep 10, 2023)
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="ml-auto">
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium">Scheduled Reports</h4>
                    <p className="text-xs text-muted-foreground">
                      End of Term Reports (Due Oct 15, 2023)
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="ml-auto">
                    <Printer className="h-4 w-4" />
                    <span className="sr-only">Print</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : null}

      <div className="flex justify-end">
        <Button size={"sm"} onClick={handleGenerateReport}>
          <FileText className="h-4 w-4" />
          {t("Generate Report")}
        </Button>
      </div>
    </div>
  );
}
