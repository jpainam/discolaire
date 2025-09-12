import { exec } from "child_process";
import fs from "fs/promises";
import { promisify } from "util";
import { Worker } from "bullmq";

import { env } from "~/env";
import { logger } from "~/utils/logger";
import { backupQueueName } from "./queue";
import { getRedis } from "./redis-client";

const asyncExec = promisify(exec);
const connection = getRedis();

logger.info("[Worker] db backup worker initialized");
new Worker(
  backupQueueName,
  async () => {
    const filename = `backup-${new Date().toISOString()}.sql`;
    const backupPath = "../../../backups";

    await fs.mkdir(backupPath, { recursive: true });

    const cmd = `pg_dump --dbname='${env.DATABASE_URL}' --file=${backupPath}/${filename} --format=c`;

    logger.info("Starting DB backup...");

    try {
      await asyncExec(cmd);
      logger.info(`Backup successful: ${filename}`);
      // Optional: upload to S3 or other storage
    } catch (err) {
      console.error("Backup failed:", err);
    }
  },
  { connection },
);
