export function getGeneratorUrl({
  reportType,
  classroomId,
  termStr,
  format,
}: {
  reportType: string;
  classroomId?: string | null;
  termStr?: string | null;
  format: "pdf" | "csv";
}) {
  if (!classroomId || !termStr) {
    return { error: "Please select a classroom and term", url: null };
  }
  const [termType, termId] = termStr.split("_");
  if (!termId) {
    throw new Error("Aucun Ids dans la sequence");
  }
  if (reportType == "001") {
    return {
      url: `/api/pdfs/gradereports/roll-of-honor?classroomId=${classroomId}&format=${format}&termId=${termId}`,
    };
  }
  if (reportType == "002") {
    let url = `/api/pdfs/reportcards/ipbw?classroomId=${classroomId}&termId=${termId}`;
    if (termType === "trim") {
      url = `/api/pdfs/reportcards/ipbw/trimestres?trimestreId=${termId}&classroomId=${classroomId}&format=${format}`;
    } else if (termType === "ann") {
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
  return { url: null, error: null };
}
export function getReportTypes() {
  return [
    { id: "001", label: "Roll of Honor" },
    { id: "002", label: "Grade report card" },
    { id: "003", label: "Statistics by course" },
    { id: "004", label: "Summary of results" },
    { id: "005", label: "Summary Report" },
  ];
}
