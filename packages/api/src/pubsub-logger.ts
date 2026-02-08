/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import z from "zod";

import type { Prisma, PrismaClient } from "@repo/db";
import { ActivityType } from "@repo/db";

export const eventSchema = z.object({
  type: z.union([
    z.enum(["create", "update", "delete"]), // prefer using these enums
    z.string().min(3).max(100),
  ]),
  data: z.object({
    metadata: z.any().optional(),
    id: z.string().optional(),
  }),
});

export class PubSubLogger {
  private userId: string;
  private schoolId: string;
  private db: PrismaClient;

  constructor(userId: string, schoolId: string, db: PrismaClient) {
    this.userId = userId;
    this.schoolId = schoolId;
    this.db = db;
  }

  async publish(entity: string, payload: z.infer<typeof eventSchema>) {
    const parsed = eventSchema.safeParse(payload);
    if (!parsed.success) throw parsed.error;

    const {
      type,
      data: { id, metadata },
    } = parsed.data;

    await this.log({
      activityType: toActivityType(entity),
      action: type.toLowerCase(),
      entity,
      entityId: id,
      data: metadata,
    });
  }

  async log(input: {
    activityType: ActivityType;
    action: string;
    entity: string;
    entityId?: string | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any;
  }) {
    await this.db.logActivity.create({
      data: {
        userId: this.userId,
        schoolId: this.schoolId,
        activityType: input.activityType,
        action: input.action,
        entity: input.entity,
        entityId: input.entityId ?? undefined,
        data: input.data as Prisma.JsonObject,
      },
    });
  }

  async logMany(
    entries: {
      activityType: ActivityType;
      action: string;
      entity: string;
      entityId?: string | null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data?: any;
    }[],
  ) {
    if (entries.length === 0) return;
    await this.db.logActivity.createMany({
      data: entries.map((entry) => ({
        userId: this.userId,
        schoolId: this.schoolId,
        activityType: entry.activityType,
        action: entry.action,
        entity: entry.entity,
        entityId: entry.entityId ?? undefined,
        data: entry.data as Prisma.JsonObject,
      })),
    });
  }
}

const toActivityType = (entity: string): ActivityType => {
  switch (entity.toLowerCase()) {
    case "document":
      return ActivityType.DOCUMENT;
    case "student":
      return ActivityType.STUDENT;
    case "staff":
      return ActivityType.STAFF;
    case "contact":
      return ActivityType.CONTACT;
    case "user":
      return ActivityType.USER;
    case "auth":
      return ActivityType.AUTH;
    case "system":
      return ActivityType.SYSTEM;
    default:
      return ActivityType.OTHER;
  }
};
