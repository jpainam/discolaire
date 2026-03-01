import type { Prisma, PrismaClient } from "@repo/db";

export const ActivityAction = {
  CREATE: "create",
  UPDATE: "update",
  DELETE: "delete",
  ENROLLED: "enrolled",
  UNENROLLED: "unenrolled",
  UPLOADED: "uploaded",
  DOWNLOADED: "downloaded",
  DISABLED: "disabled",
} as const;
export type ActivityAction = (typeof ActivityAction)[keyof typeof ActivityAction];

/**
 * The target of a log entry — what this activity was performed on.
 * Distinct from the app's "entity" concept (contact/staff/student only)
 * and from the "Subject" model (course↔classroom assignment).
 */
export const ActivityTargetType = {
  STUDENT: "student",
  STAFF: "staff",
  CONTACT: "contact",
  CLASSROOM: "classroom",
  DOCUMENT: "document",
  USER: "user",
  PERMISSION: "permission",
} as const;
export type ActivityTargetType =
  (typeof ActivityTargetType)[keyof typeof ActivityTargetType];

interface LogEntry {
  action: ActivityAction;
  targetType: ActivityTargetType;
  targetId?: string | null;
  description: string;
  metadata?: Prisma.InputJsonObject;
}

export class ActivityLogger {
  private userId: string;
  private _userName: string;
  private schoolId: string;
  private db: PrismaClient;

  constructor(
    userId: string,
    userName: string,
    schoolId: string,
    db: PrismaClient,
  ) {
    this.userId = userId;
    this._userName = userName;
    this.schoolId = schoolId;
    this.db = db;
  }

  /** The display name of the user performing the action — use in description strings. */
  get actor(): string {
    return this._userName;
  }

  /** Fire-and-forget — never blocks or fails the calling mutation. */
  log(input: LogEntry): void {
    void this.db.logActivity
      .create({
        data: {
          userId: this.userId,
          schoolId: this.schoolId,
          action: input.action,
          targetType: input.targetType,
          targetId: input.targetId ?? undefined,
          description: input.description,
          metadata: input.metadata,
        },
      })
      .catch((err: unknown) => {
        console.error("[activity-log] failed to write log", err);
      });
  }

  /** Fire-and-forget bulk variant — never blocks or fails the calling mutation. */
  logMany(entries: LogEntry[]): void {
    if (entries.length === 0) return;
    void this.db.logActivity
      .createMany({
        data: entries.map((entry) => ({
          userId: this.userId,
          schoolId: this.schoolId,
          action: entry.action,
          targetType: entry.targetType,
          targetId: entry.targetId ?? undefined,
          description: entry.description,
          metadata: entry.metadata,
        })),
      })
      .catch((err: unknown) => {
        console.error("[activity-log] failed to write logs", err);
      });
  }
}
