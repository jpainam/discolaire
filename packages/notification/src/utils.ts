import { Queue } from "bullmq";

import { getDb } from "@repo/db";
import redisClient from "@repo/kv";

import { env } from "./env";

export const db = getDb({ connectionString: env.DATABASE_URL });

// Define queues
export const notificationQueue = new Queue("notification", {
  connection: redisClient,
});
