import IORedis from "ioredis";

import { env } from "~/env";

export let connection: IORedis | null = null;

export const getRedis = () => {
  connection ??= new IORedis(`${env.REDIS_URL}?family=0`, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    lazyConnect: true,
  });

  return connection;
};
