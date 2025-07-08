/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Queue } from "bullmq";
import { z } from "zod/v4";

import connection from "@repo/kv";

export const logQueue = new Queue("log-queue", { connection });

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

  constructor(userId: string, schoolId: string) {
    this.userId = userId;
    this.schoolId = schoolId;
  }

  async publish(entity: string, payload: z.infer<typeof eventSchema>) {
    const parsed = eventSchema.safeParse(payload);
    if (!parsed.success) throw parsed.error;

    const {
      type,
      data: { id, metadata },
    } = parsed.data;

    await logQueue.add("log-action", {
      userId: this.userId,
      action: type.toLowerCase(),
      schoolId: this.schoolId,
      entity,
      entityId: id,
      metadata: metadata,
    });
  }
}
