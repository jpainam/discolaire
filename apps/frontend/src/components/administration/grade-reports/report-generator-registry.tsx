import { TermType } from "@repo/db/enums";





export function getGeneratorUrl({
  reportType,
  classroomId,
  termId,
  termType,
  format,
}: {
  reportType: string;
  classroomId?: string | null;
  termId: string | null;
  termType?: TermType;
  format: "pdf" | "csv";
}) {
  if (!classroomId || !termId) {
    return { error: "Please select a classroom and term", url: null };
  }

  if (reportType == "001") {
    return {
      url: `/api/pdfs/gradereports/roll-of-honor?classroomId=${classroomId}&format=${format}&termId=${termId}`,
    };
  }
  if (reportType == "002") {
    let url = `/api/pdfs/reportcards/ipbw?classroomId=${classroomId}&termId=${termId}`;

    if (termType == TermType.QUARTER) {
      url = `/api/pdfs/reportcards/ipbw/trimestres?trimestreId=${termId}&classroomId=${classroomId}&format=${format}`;
    } else if (termType == TermType.ANNUAL) {
      url = `/api/pdfs/reportcards/ipbw/annual?classroomId=${classroomId}&format=${format}`;
    }
    return { url, error: null };
  }
  if (reportType == "004") {
    return {
      url: `/api/pdfs/gradereports/summary-of-results?classroomId=${classroomId}&termId=${termId}&format=${format}`,
      error: null,
    };
  }
  if (reportType == "005") {
    return {
      url: `/api/pdfs/gradereports/summary-report?classroomId=${classroomId}&format=${format}&termId=${termId}&termType=${termType}`,
    };
  }
  if (reportType == "006") {
    return {
      url: `/api/pdfs/gradereports/summary?classroomId=${classroomId}&format=${format}&termId=${termId}&termType=${termType}`,
    };
  }
  return { url: null, error: null };
}
export function getReportTypes() {
  return [
    { id: "001", label: "Roll of Honor" },
    { id: "002", label: "Grade report card" },
    { id: "003", label: "Statistics by course" },
    { id: "004", label: "Summary of results (10 first/10 last)" },
    { id: "005", label: "Summary Report" },
    { id: "006", label: "Synthèse des résultats de la classe" },
  ];
}