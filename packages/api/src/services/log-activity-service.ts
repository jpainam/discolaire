import type { PrismaClient } from "@repo/db";
import { ActivityType } from "@repo/db";

/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
const titleCase = (value: string) =>
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  value.length > 0 ? value?.[0]?.toUpperCase() + value.slice(1) : value;

export class LogActivityService {
  private db: PrismaClient;
  constructor(db: PrismaClient) {
    this.db = db;
  }
  formatLogActivity = (
    log: any,
  ): {
    id: number;
    createdAt: Date;
    title: string;
    description: string;
    activityType: ActivityType;
    action: string;
    entity: string;
    entityId?: string | null;
  } => {
    const data = (log.data ?? {}) as Record<string, unknown>;
    const action = log.action.toLowerCase();
    const entity = log.entity.toLowerCase();

    const fallbackTitle = `${titleCase(entity)} ${action}`;
    const fallbackDescription = log.entityId
      ? `${log.entity} ${log.entityId}`
      : log.entity;

    switch (log.activityType) {
      case ActivityType.DOCUMENT: {
        const filename =
          (data.filename as string | undefined) ??
          (data.title as string | undefined) ??
          "Document";
        const title = `Document ${action}`;
        const description = `${filename}${log.entityId ? ` • ${log.entityId}` : ""}`;
        return {
          id: log.id,
          createdAt: log.createdAt,
          title,
          description,
          activityType: log.activityType,
          action: log.action,
          entity: log.entity,
          entityId: log.entityId,
        };
      }
      case ActivityType.STUDENT:
      case ActivityType.STAFF:
      case ActivityType.CONTACT: {
        const name = (data.name as string | undefined) ?? titleCase(entity);
        const reg = data.registrationNumber as string | undefined;
        const title = `${titleCase(entity)} ${action}`;
        const description = reg ? `${name} • ${reg}` : name;
        return {
          id: log.id,
          createdAt: log.createdAt,
          title,
          description,
          activityType: log.activityType,
          action: log.action,
          entity: log.entity,
          entityId: log.entityId,
        };
      }
      case ActivityType.AUTH: {
        const username = data.username as string | undefined;
        const title = action === "login" ? "User login" : `Auth ${action}`;
        const description = username ?? log.entityId ?? "User";
        return {
          id: log.id,
          createdAt: log.createdAt,
          title,
          description,
          activityType: log.activityType,
          action: log.action,
          entity: log.entity,
          entityId: log.entityId,
        };
      }
      case ActivityType.USER: {
        const name = (data.name as string | undefined) ?? "User";
        const title = `User ${action}`;
        const description = name;
        return {
          id: log.id,
          createdAt: log.createdAt,
          title,
          description,
          activityType: log.activityType,
          action: log.action,
          entity: log.entity,
          entityId: log.entityId,
        };
      }
      default: {
        return {
          id: log.id,
          createdAt: log.createdAt,
          title: fallbackTitle,
          description: fallbackDescription,
          activityType: log.activityType,
          action: log.action,
          entity: log.entity,
          entityId: log.entityId,
        };
      }
    }
  };
  formatLogActivities = (logs: any[]) => logs.map(this.formatLogActivity);
}
