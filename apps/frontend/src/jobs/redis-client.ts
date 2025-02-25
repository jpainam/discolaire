/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import IORedis from "ioredis";

import { env } from "~/env";

export let connection: IORedis | null = null;

export const getRedis = () => {
  if (!connection) {
    connection = new IORedis(`${env.REDIS_URL}?family=0`, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    });
  }
  return connection;
};
