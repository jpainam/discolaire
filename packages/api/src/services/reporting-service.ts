import { env } from "../env";

export async function submitReportJob(
  url: string,
  data: Record<string, unknown> & {
    id: number;
    userId: string;
  } & object,
) {
  try {
    console.log("submitReportJob", url, data.id);
    const fullUrl = `${env.REPORTING_URL}/${url}`;
    const body = JSON.stringify(
      {
        ...data,
        callback: `${env.NEXT_PUBLIC_BASE_URL}/api/reports`,
      },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      (key, value) => (value === undefined ? null : value),
    );

    const response = await fetch(fullUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body,
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
