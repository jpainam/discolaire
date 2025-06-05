"use client";

import { FileText } from "lucide-react";
import { useState } from "react";

import { Button } from "@repo/ui/components/button";
import { Label } from "@repo/ui/components/label";
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/radio-group";
import { ClassroomSelector } from "~/components/shared/selects/ClassroomSelector";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { useLocale } from "~/i18n";

const reportTypes = [
  { id: "individual", label: "Individual Student Report" },
  { id: "class", label: "Class Summary Report" },
  { id: "progress", label: "Progress Report" },
  { id: "final", label: "Final Grade Report" },
];

export function GradeReportGenerator() {
  const [selectedClass, setSelectedClass] = useState("");
  const [reportType, setReportType] = useState("individual");
  const [includeOptions, _setIncludeOptions] = useState({
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
              <Label>{t("classrooms")}</Label>
              <ClassroomSelector
                onChange={(val) => {
                  setSelectedClass(val ?? "");
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label>{t("terms")}</Label>
              <TermSelector />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Report Type</Label>
            <RadioGroup
              defaultValue="individual"
              value={reportType}
              onValueChange={setReportType}
              className={"grid grid-cols-2 gap-2"}
            >
              {reportTypes.map((type) => (
                <div key={type.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={type.id} id={type.id} />
                  <Label htmlFor={type.id}>{type.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button size={"sm"} onClick={handleGenerateReport}>
          <FileText className="h-4 w-4" />
          {t("Generate Report")}
        </Button>
      </div>
    </div>
  );
}
