import type { RouterOutputs } from ".";

export type Classroom =
  | RouterOutputs["classroom"]["get"]
  | RouterOutputs["classroom"]["all"][number];

export type User =
  | RouterOutputs["user"]["get"]
  | RouterOutputs["user"]["all"]["data"][number];

export type Subject =
  | RouterOutputs["subject"]["get"]
  | RouterOutputs["subject"]["all"][number]
  | RouterOutputs["classroom"]["subjects"][number];
