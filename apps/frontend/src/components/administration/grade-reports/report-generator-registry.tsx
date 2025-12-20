export function getGeneratorUrl({
  reportType,
  classroomId,
  termId,
  format,
}: {
  reportType: string;
  classroomId?: string | null;
  termId: string | null;
  format: "pdf" | "csv";
}) {
  // TODO termType
  const termType = "trim";
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
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
