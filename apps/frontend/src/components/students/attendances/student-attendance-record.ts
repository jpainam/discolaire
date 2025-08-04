export type AttendanceRecordType =
  | "absence"
  | "chatter"
  | "consigne"
  | "exclusion"
  | "lateness";
export interface AttendanceRecord {
  id: number;
  type: AttendanceRecordType;
  date: Date;
  term: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details: any;
  justified: number;
}
