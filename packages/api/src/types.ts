import type { RouterOutputs } from ".";

export type Student =
  | RouterOutputs["student"]["get"]
  | RouterOutputs["student"]["all"][number];

export type Classroom =
  | RouterOutputs["classroom"]["get"]
  | RouterOutputs["classroom"]["all"][number];

export type Policy =
  | RouterOutputs["policy"]["get"]
  | RouterOutputs["policy"]["all"][number];

export type User =
  | RouterOutputs["user"]["get"]
  | RouterOutputs["user"]["all"][number];
