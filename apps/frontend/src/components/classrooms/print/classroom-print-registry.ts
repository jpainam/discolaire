export type ClassroomPrintCategoryId =
  | "students"
  | "academics"
  | "finances"
  | "reportcards"
  | "administration";

export type ClassroomPrintParamKey =
  | "format"
  | "termId"
  | "subjectId"
  | "journalId"
  | "status"
  | "dueDate"
  | "gradesheetId";

export type ClassroomPrintFormat = "pdf" | "csv";

export interface ClassroomPrintQueryParams {
  format: ClassroomPrintFormat;
  termId: string | null;
  subjectId: string | null;
  journalId: string | null;
  status: string | null;
  dueDate: string | null;
  gradesheetId: string | null;
}

export interface ClassroomPrintContext {
  classroomId: string;
  params: ClassroomPrintQueryParams;
}

export interface ClassroomPrintAction {
  id: string;
  order: number;
  label: string;
  description?: string;
  category: ClassroomPrintCategoryId;
  requiredParams?: ClassroomPrintParamKey[];
  buildUrl: (ctx: ClassroomPrintContext) => string;
}

export const CLASSROOM_PRINT_PARAM_LABELS: Record<
  ClassroomPrintParamKey,
  string
> = {
  format: "format",
  termId: "term",
  subjectId: "subject",
  journalId: "journal",
  status: "status",
  dueDate: "due date",
  gradesheetId: "grade sheet ID",
};

export const CLASSROOM_PRINT_CATEGORIES: {
  id: ClassroomPrintCategoryId;
  label: string;
}[] = [
  { id: "students", label: "Students" },
  { id: "academics", label: "Academic" },
  { id: "finances", label: "Finance" },
  { id: "reportcards", label: "Report cards" },
  { id: "administration", label: "Administration" },
];

const toIsoDate = (value: string | null) => {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toISOString();
};

export const CLASSROOM_PRINT_ACTIONS: ClassroomPrintAction[] = [
  {
    id: "100",
    order: 100,
    label: "Student list",
    category: "students",
    requiredParams: ["format"],
    buildUrl: ({ classroomId, params }) =>
      `/api/pdfs/classroom/students?id=${classroomId}&format=${params.format}`,
  },
  {
    id: "101",
    order: 101,
    label: "Student list (A4 preview)",
    category: "students",
    requiredParams: ["format"],
    buildUrl: ({ classroomId, params }) =>
      `/api/pdfs/classroom/students?id=${classroomId}&preview=true&size=a4&format=${params.format}`,
  },
  {
    id: "102",
    order: 200,
    label: "Subjects",
    category: "academics",
    requiredParams: ["format"],
    buildUrl: ({ classroomId, params }) =>
      `/api/pdfs/classroom/${classroomId}/subjects?format=${params.format}`,
  },
  {
    id: "103",
    order: 201,
    label: "Programs",
    category: "academics",
    requiredParams: ["format"],
    buildUrl: ({ classroomId, params }) =>
      `/api/pdfs/classroom/${classroomId}/programs?format=${params.format}`,
  },
  {
    id: "104",
    order: 202,
    label: "Programs (selected subject)",
    description: "Requires subject",
    category: "academics",
    requiredParams: ["format", "subjectId"],
    buildUrl: ({ classroomId, params }) =>
      `/api/pdfs/classroom/${classroomId}/programs?format=${params.format}&subjectId=${params.subjectId ?? ""}`,
  },
  {
    id: "105",
    order: 203,
    label: "Grade sheet template",
    description: "Export the blank grade sheet for this classroom",
    category: "academics",
    buildUrl: ({ classroomId }) =>
      `/api/pdfs/exports/gradesheets?classroomId=${classroomId}`,
  },
  {
    id: "106",
    order: 204,
    label: "Grade sheets",
    description: "Requires term and subject",
    category: "academics",
    requiredParams: ["format", "termId", "subjectId"],
    buildUrl: ({ classroomId, params }) =>
      `/api/pdfs/classroom/${classroomId}/gradesheets?termId=${params.termId ?? ""}&subjectId=${params.subjectId ?? ""}&format=${params.format}`,
  },
  {
    id: "107",
    order: 205,
    label: "Grade sheet by ID",
    description: "Requires grade sheet ID",
    category: "academics",
    requiredParams: ["format", "gradesheetId"],
    buildUrl: ({ classroomId, params }) =>
      `/api/pdfs/gradesheets/${params.gradesheetId ?? ""}?format=${params.format}&classroomId=${classroomId}`,
  },
  {
    id: "108",
    order: 300,
    label: "Fees",
    category: "administration",
    requiredParams: ["format"],
    buildUrl: ({ classroomId, params }) =>
      `/api/pdfs/classroom/${classroomId}/fees?format=${params.format}`,
  },
  {
    id: "109",
    order: 400,
    label: "Financial situation",
    description: "Requires journal and status",
    category: "finances",
    requiredParams: ["format", "journalId", "status"],
    buildUrl: ({ classroomId, params }) =>
      `/api/pdfs/classroom/${classroomId}/finances?journalId=${params.journalId ?? ""}&format=${params.format}&classroomId=${classroomId}&status=${params.status ?? ""}`,
  },
  {
    id: "109A",
    order: 401,
    label: "Financial situation (legacy endpoint)",
    category: "finances",
    requiredParams: ["format"],
    buildUrl: ({ classroomId, params }) =>
      `/api/pdfs/classroom/${classroomId}/finances/&format=${params.format}`,
  },
  {
    id: "110",
    order: 402,
    label: "Balance reminder letter",
    description: "Requires journal and due date",
    category: "finances",
    requiredParams: ["format", "journalId", "dueDate"],
    buildUrl: ({ classroomId, params }) =>
      `/api/pdfs/transactions/reminder-letter?journalId=${params.journalId ?? ""}&format=${params.format}&dueDate=${toIsoDate(params.dueDate)}&classroomId=${classroomId}`,
  },
  {
    id: "111",
    order: 500,
    label: "Report card by term",
    description: "Requires term",
    category: "reportcards",
    requiredParams: ["termId"],
    buildUrl: ({ classroomId, params }) =>
      `/api/pdfs/reportcards/ipbw?classroomId=${classroomId}&termId=${params.termId ?? ""}`,
  },
  {
    id: "112",
    order: 501,
    label: "Annual report card",
    category: "reportcards",
    requiredParams: ["format"],
    buildUrl: ({ classroomId, params }) =>
      `/api/pdfs/reportcards/ipbw/annual?classroomId=${classroomId}&format=${params.format}`,
  },
  {
    id: "113",
    order: 502,
    label: "Report card scoring grid",
    description: "Requires term",
    category: "reportcards",
    requiredParams: ["termId"],
    buildUrl: ({ classroomId, params }) =>
      `/api/pdfs/reportcards/ipbw/scoring?classroomId=${classroomId}&termId=${params.termId ?? ""}`,
  },
  {
    id: "114",
    order: 503,
    label: "Report card teacher comments",
    description: "Requires term",
    category: "reportcards",
    requiredParams: ["termId"],
    buildUrl: ({ classroomId, params }) =>
      `/api/pdfs/reportcards/ipbw/teachers_comments?classroomId=${classroomId}&termId=${params.termId ?? ""}`,
  },
  {
    id: "115",
    order: 504,
    label: "Report card competencies",
    description: "Requires term",
    category: "reportcards",
    requiredParams: ["termId"],
    buildUrl: ({ classroomId, params }) =>
      `/api/pdfs/reportcards/ipbw/competences?classroomId=${classroomId}&termId=${params.termId ?? ""}`,
  },
];
