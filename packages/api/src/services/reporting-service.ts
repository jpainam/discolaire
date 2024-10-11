// import { Queue } from "bullmq";
// import IORedis from "ioredis";

import { env } from "../../env";

export async function submitReportJob(
  url: string,
  data: Record<string, unknown> & {
    id: number;
    userId: string;
  },
) {
  try {
    console.log("submitReportJob", url, data.id);
    const fullUrl = `${env.REPORTING_URL}/${url}`;
    const response = await fetch(fullUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to submit report job: ${response.statusText}`);
    }
    return response.json() as unknown;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
