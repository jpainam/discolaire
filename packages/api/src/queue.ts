import "server-only";

import { Queue } from "bullmq";

import connection from "@repo/kv";

export const logQueue = new Queue("log-queue", { connection });
export const notificationQueue = new Queue("notification", { connection });
