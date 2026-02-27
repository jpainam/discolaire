import { spawn } from "child_process";
import fs from "fs/promises";

import { env } from "~/env";
import { logger } from "~/utils/logger";

export async function runDbBackup() {
  const filename = `backup-${new Date().toISOString()}.sql`;
  const backupPath = env.LOCAL_BACKUP_PATH ?? "/var/backups/discolaire";

  await fs.mkdir(backupPath, { recursive: true });

  logger.info("[Cron] Starting DB backup...");

  try {
    await new Promise<void>((resolve, reject) => {
      const proc = spawn("pg_dump", [
        `--dbname=${env.DATABASE_URL}`,
        `--file=${backupPath}/${filename}`,
        "--format=c",
      ]);
      proc.on("close", (code) =>
        code === 0
          ? resolve()
          : reject(new Error(`pg_dump exited with code ${code}`)),
      );
    });
    logger.info(`[Cron] Backup successful: ${filename}`);
  } catch (err) {
    logger.error(`[Cron] Backup failed: ${String(err)}`);
  }
}
