import { Queue } from "bullmq";
import IORedis from "ioredis";
import { env } from "~/env";

const connection = new IORedis(`${env.REDIS_URL}?family=0`, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

// Define queues
export const emailQueue = new Queue("email", { connection });
export const smsQueue = new Queue("sms", { connection });
export const logQueue = new Queue("log", { connection });
