/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type { PrismaClient } from "@repo/db";

export interface FormattedLogActivity {
  id: number;
  createdAt: Date;
  action: string;
  entityType: string;
  entityId?: string | null;
  description: string;
}

export class LogActivityService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(_db: PrismaClient) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formatLogActivity = (log: any): FormattedLogActivity => ({
    id: log.id as number,
    createdAt: log.createdAt as Date,
    action: log.action as string,
    entityType: log.entityType as string,
    entityId: log.entityId as string | null | undefined,
    description: log.description as string,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formatLogActivities = (logs: any[]) => logs.map(this.formatLogActivity);
}
