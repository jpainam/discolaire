import { Queue } from "bullmq";

import { getDb } from "@repo/db";
import redisClient from "@repo/kv";

import { env } from "./env";

export function getNotificationDb(tenant?: string | null) {
  return getDb({ connectionString: env.DATABASE_URL, tenant: tenant ?? "public" });
}

export const db = getNotificationDb();

// Define queues
export const notificationQueue = new Queue("notification", {
  connection: redisClient,
});
