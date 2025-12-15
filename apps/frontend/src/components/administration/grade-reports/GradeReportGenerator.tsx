"use client";

import { useQuery } from "@tanstack/react-query";
import { FileText } from "lucide-react";
import { useTranslations } from "next-intl";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { toast } from "sonner";

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { ClassroomSelector } from "~/components/shared/selects/ClassroomSelector";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useModal } from "~/hooks/use-modal";
import { useSchool } from "~/providers/SchoolProvider";
import { useTRPC } from "~/trpc/react";
import { StatisticByCourseDialog } from "./StatisticByCourseDialog";

const reportTypes = [
  { id: "001", label: "Roll of Honor" },
  { id: "002", label: "Grade report card" },
  { id: "003", label: "Statistics by course" },
  { id: "004", label: "Summary of results" },
];

export function GradeReportGenerator({ limited }: { limited: boolean }) {
  const [classroomId, setClassroomId] = useQueryState("classroomId");
  const [reportType, setReportType] = useQueryState("individual");
  const [termStr, setTermStr] = useQueryState("termStr");
  // const [termId, setTermId] = useQueryState<{
  //   id: string;
  //   type: "trim" | "seq" | "ann";
  // } | null>();
  const [format, setFormat] = useQueryState(
    "format",
    parseAsStringLiteral(["pdf", "csv"]),
  );

  const t = useTranslations();
  const trpc = useTRPC();
  const termQuery = useQuery(trpc.term.all.queryOptions());
  const { school } = useSchool();
  const { openModal } = useModal();

  const handleGenerateReport = () => {
    if (reportType == "003") {
      openModal({
        view: <StatisticByCourseDialog format={format ?? "pdf"} />,
      });
      return;
    }
    if (!classroomId || !termStr) {
      toast.error(t("Please select a classroom and term"));
      return;
    }
    const [termType, termId] = termStr.split("_");
    if (!termId) {
      throw new Error("Aucun Ids dans la sequence");
    }
    if (reportType == "001") {
      window.open(
        `/api/pdfs/gradereports/roll-of-honor?classroomId=${classroomId}&format=${format}&termId=${termId}`,
        "_blank",
      );
      return;
    }
    if (reportType == "002") {
      let url = `/api/pdfs/reportcards/ipbw?classroomId=${classroomId}&termId=${termId}`;
      if (termType === "trim") {
        url = `/api/pdfs/reportcards/ipbw/trimestres?trimestreId=${termId}&classroomId=${classroomId}&format=pdf`;
      } else if (termType === "ann") {
        url = `/api/pdfs/reportcards/ipbw/annual?classroomId=${classroomId}&format=pdf`;
      }
      window.open(url, "_blank");
      return;
    }
    if (reportType == "004") {
      window.open(
        `/api/pdfs/gradereports/summary-of-results?classroomId=${classroomId}&termId=${termId}&format=${format}`,
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
            onValueChange={(val) => setFormat(val as "pdf" | "csv")}
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
              defaultValue={classroomId ?? undefined}
              onSelect={(val) => {
                void setClassroomId(val);
              }}
            />
          </div>
          <div className="grid gap-2">
            <Label>{t("terms")}</Label>
            <Select
              defaultValue={termStr ?? undefined}
              onValueChange={(value) => {
                void setTermStr(value);
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
                <SelectItem value="ann_annual">{t("Annual")}</SelectItem>
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
          {(limited ? reportTypes.slice(0, 4) : reportTypes).map((type) => (
            <div key={type.id} className="flex items-center space-x-2">
              <RadioGroupItem value={type.id} id={type.id} />
              <Label htmlFor={type.id}>{t(type.label)}</Label>
            </div>
          ))}
        </RadioGroup>

        <div className="flex justify-end">
          <Button disabled={!reportType} onClick={handleGenerateReport}>
            <FileText />
            {t("Generate Report")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
