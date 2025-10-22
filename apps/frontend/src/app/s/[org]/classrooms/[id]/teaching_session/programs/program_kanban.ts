import type { RouterOutputs } from "@repo/api";

export interface SubjectProgramItem {
  id: string;
  title: string;
  coverage: number;
  description: string | null;
  requiredSessionCount: number;
  sessionsCount: number;
  lastSession?: RouterOutputs["program"]["get"]["teachingSessions"][number];
  categoryId: string;
}
