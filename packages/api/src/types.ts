import type { RouterOutputs } from ".";

export type Student =
  | RouterOutputs["student"]["get"]
  | RouterOutputs["student"]["all"][number];

export type Classroom =
  | RouterOutputs["classroom"]["get"]
  | RouterOutputs["classroom"]["all"][number];
