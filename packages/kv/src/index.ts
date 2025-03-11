import "server-only";

import IORedis from "ioredis";

class RedisClient {
  private static instance: IORedis;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {} // Prevent instantiation

  public static getInstance(): IORedis {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!this.instance) {
      this.instance = new IORedis(`${process.env.REDIS_URL}?family=0`, {
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
      });

      this.instance.on("connect", () =>
        console.log("✅ Redis connection successful"),
      );
      this.instance.on("error", (err) => console.error("❌ Redis error:", err));
    }
    return this.instance;
  }
}

// Export the Redis singleton instance
const client = RedisClient.getInstance();
// const redis = new IORedis(process.env.REDIS_URL ?? "redis://localhost:6379");

// redis
//   .ping()
//   .then(() => console.log("✅ Redis connection successful"))
//   .catch((err) => console.error("❌ Redis connection failed:", err));
export default client;
