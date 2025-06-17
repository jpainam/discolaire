"use client";

import { FileText } from "lucide-react";
import { useState } from "react";

import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Label } from "@repo/ui/components/label";
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { toast } from "sonner";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { ClassroomSelector } from "~/components/shared/selects/ClassroomSelector";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { useLocale } from "~/i18n";
const reportTypes = [
  { id: "001", label: "Roll of Honor" },
  { id: "individual", label: "Individual Student Report" },
  { id: "class", label: "Class Summary Report" },
  { id: "progress", label: "Progress Report" },
  { id: "final", label: "Final Grade Report" },
];

export function GradeReportGenerator() {
  const [selectedClass, setSelectedClass] = useState<string | null>();
  const [reportType, setReportType] = useState("individual");
  const [termId, setTermId] = useState<string | null>();
  const [formatType, setFormatType] = useState("pdf");

  const { t } = useLocale();

  const handleGenerateReport = () => {
    if (!selectedClass || !termId) {
      toast.error(t("Please select a classroom and term"));
      return;
    }
    if (reportType == "001") {
      window.open(
        `/api/pdfs/gradereports/roll-of-honor?classroomId=${selectedClass}&format=${formatType}&termId=${termId}`,
        "_blank"
      );
    } else {
      toast.warning(
        t("This report type is not yet implemented. Please check back later.")
      );
    }
  };

  return (
    <Card className="lg:col-span-4">
      <CardHeader>
        <CardTitle>{t("Grade Report Generator")}</CardTitle>
        <CardDescription className="text-xs">
          {t("Generate and download grade reports")}
        </CardDescription>
        <CardAction>
          <Select defaultValue="pdf" onValueChange={setFormatType}>
            <SelectTrigger size="sm" className="h-7">
              <SelectValue placeholder="Format" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="pdf">
                <PDFIcon />
                Pdf
              </SelectItem>
              <SelectItem value="csv">
                <XMLIcon />
                Excel
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="grid xl:grid-cols-2 gap-4 mb-4">
          <div className="grid gap-2">
            <Label>{t("classrooms")}</Label>
            <ClassroomSelector
              onChange={(val) => {
                setSelectedClass(val);
              }}
            />
          </div>
          <div className="grid gap-2">
            <Label>{t("terms")}</Label>
            <TermSelector onChange={(val) => setTermId(val)} />
          </div>
        </div>

        <RadioGroup
          defaultValue="individual"
          value={reportType}
          onValueChange={setReportType}
          className={"grid grid-cols-2 gap-2"}
        >
          {reportTypes.map((type) => (
            <div key={type.id} className="flex items-center space-x-2">
              <RadioGroupItem value={type.id} id={type.id} />
              <Label htmlFor={type.id}>{t(type.label)}</Label>
            </div>
          ))}
        </RadioGroup>

        <div className="flex justify-end">
          <Button size={"sm"} onClick={handleGenerateReport}>
            <FileText className="h-4 w-4" />
            {t("Generate Report")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
