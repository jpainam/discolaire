"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileText } from "lucide-react";
import { toast } from "sonner";

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

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { ClassroomSelector } from "~/components/shared/selects/ClassroomSelector";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { useSchool } from "~/providers/SchoolProvider";
import { useTRPC } from "~/trpc/react";
import { StatisticByCourseDialog } from "./StatisticByCourseDialog";

const reportTypes = [
  { id: "001", label: "Roll of Honor" },
  { id: "002", label: "Grade report card" },
  { id: "003", label: "Statistics by course" },
  { id: "004", label: "Summary of results" },
];

export function GradeReportGenerator() {
  const [selectedClass, setSelectedClass] = useState<string | null>();
  const [reportType, setReportType] = useState("individual");
  const [selectedTerm, setTerm] = useState<{
    id: string;
    type: "trim" | "seq" | "ann";
  } | null>();
  const [formatType, setFormatType] = useState<"pdf" | "csv">("pdf");

  const { t } = useLocale();
  const trpc = useTRPC();
  const termQuery = useQuery(trpc.term.all.queryOptions());
  const { school } = useSchool();
  const { openModal } = useModal();

  const handleGenerateReport = () => {
    if (reportType == "003") {
      openModal({
        view: <StatisticByCourseDialog format={formatType} />,
      });
      return;
    }
    if (!selectedClass || !selectedTerm) {
      toast.error(t("Please select a classroom and term"));
      return;
    }
    if (reportType == "001") {
      window.open(
        `/api/pdfs/gradereports/roll-of-honor?classroomId=${selectedClass}&format=${formatType}&termId=${selectedTerm.id}`,
        "_blank",
      );
      return;
    }
    if (reportType == "002") {
      let url = `/api/pdfs/reportcards/ipbw?classroomId=${selectedClass}&termId=${selectedTerm.id}`;
      if (selectedTerm.type === "trim") {
        url = `/api/pdfs/reportcards/ipbw/trimestres?trimestreId=${selectedTerm.id}&classroomId=${selectedClass}&format=pdf`;
      } else if (selectedTerm.type === "ann") {
        url = `/api/pdfs/reportcards/ipbw/annual?classroomId=${selectedClass}&format=pdf`;
      }
      window.open(url, "_blank");
      return;
    }
    if (reportType == "004") {
      window.open(
        `/api/pdfs/gradereports/summary-of-results?classroomId=${selectedClass}&termId=${selectedTerm.id}&format=${formatType}`,
        "_blank",
      );
      return;
    }

    toast.warning(
      t("This report type is not yet implemented. Please check back later."),
    );
  };

  return (
    <Card className="lg:col-span-4">
      <CardHeader>
        <CardTitle>{t("Grade Report Generator")}</CardTitle>
        <CardDescription className="text-xs">
          {t("Generate and download grade reports")}
        </CardDescription>
        <CardAction>
          <Select
            defaultValue="pdf"
            onValueChange={(val) => setFormatType(val as "pdf" | "csv")}
          >
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
        <div className="mb-4 grid gap-4 xl:grid-cols-2">
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
            <Select
              onValueChange={(value) => {
                const [type, id] = value.split("_");
                if (!id) {
                  setTerm(null);
                  return;
                }
                setTerm({
                  id,
                  type:
                    type === "trim" ? "trim" : type === "seq" ? "seq" : "ann",
                });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("terms")} />
              </SelectTrigger>
              <SelectContent>
                {termQuery.data?.map((term) => (
                  <SelectItem key={term.id} value={`seq_${term.id}`}>
                    {term.name}
                  </SelectItem>
                ))}
                {school.hasQuarterlyReports && (
                  <>
                    <SelectItem value="trim_trim1">
                      {t("Trimestre 1")}
                    </SelectItem>
                    <SelectItem value="trim_trim2">
                      {t("Trimestre 2")}
                    </SelectItem>
                    <SelectItem value="trim_trim3">
                      {t("Trimestre 3")}
                    </SelectItem>
                  </>
                )}
                <SelectItem value="ann_annual">{t("Annuel")}</SelectItem>
              </SelectContent>
            </Select>
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
