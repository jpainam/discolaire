import { Queue } from "bullmq";
import IORedis from "ioredis";

import { env } from "../../env";

export let connection: IORedis | null = null;

export const getRedis = () => {
  if (!connection) {
    connection = new IORedis(`${env.REDIS_URL}?family=0`, {
      maxRetriesPerRequest: null,
    });
  }
  return connection;
};

const reportQueue = new Queue("reportQueue", { connection: getRedis() });

export async function submitReportJob(
  format: "pdf" | "excel",
  data: Record<string, unknown> & {
    reportType: string;
    id: number;
    userId: string;
  },
) {
  await reportQueue.add("generateReport", {
    format,
    data,
  });
  console.log("Report job submitted:", data.reportType);
}
