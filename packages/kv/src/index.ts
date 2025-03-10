import "server-only";

import IORedis from "ioredis";

import { env } from "./env";

class RedisClient {
  private static instance: IORedis;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {} // Prevent instantiation

  public static getInstance(): IORedis {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!this.instance) {
      this.instance = new IORedis(`${env.REDIS_URL}?family=0`, {
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
      });

      this.instance.on("connect", () => console.log("🚀 Redis connected"));
      this.instance.on("error", (err) => console.error("❌ Redis error:", err));
    }
    return this.instance;
  }
}

// Export the Redis singleton instance
const client = RedisClient.getInstance();
export default client;
