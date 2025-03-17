import type { RouterOutputs } from ".";

export type Classroom =
  | RouterOutputs["classroom"]["get"]
  | RouterOutputs["classroom"]["all"][number];

export type Policy =
  | RouterOutputs["policy"]["get"]
  | RouterOutputs["policy"]["all"][number];

export type User =
  | RouterOutputs["user"]["get"]
  | RouterOutputs["user"]["all"][number];

export type Subject =
  | RouterOutputs["subject"]["get"]
  | RouterOutputs["subject"]["all"][number]
  | RouterOutputs["classroom"]["subjects"][number];

export interface TrimestreSubjectType {
  subjectId: number;
  grade1: number | null;
  grade2: number | null;
  average: number | null;
  coeff: number;
  total: number | null;
  rank: number;
}
