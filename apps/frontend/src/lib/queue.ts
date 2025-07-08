import { Queue } from "bullmq";
import IORedis from "ioredis";
import { env } from "~/env";

const connection = new IORedis(`${env.REDIS_URL}?family=0`, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

// Define queues
export const notificationQueue = new Queue("notification", { connection });
