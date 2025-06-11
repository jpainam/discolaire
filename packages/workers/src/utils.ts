import IORedis from "ioredis";

export let connection: IORedis | null = null;
const redisUrl = process.env.REDIS_URL ?? "redis://localhost:6379";
export const getRedis = () => {
  connection ??= new IORedis(`${redisUrl}?family=0`, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });

  return connection;
};
