import type { NextRequest } from "next/server";

// https://github.com/calcom/cal.com/blob/main/apps/web/app/api/parseRequestData.ts
export async function parseUrlParams(
  req: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<Record<string, any>> {
  try {
    // Read raw text body (because Next.js does NOT parse x-www-form-urlencoded automatically)
    const rawBody = await req.text();
    const params = new URLSearchParams(rawBody);
    return Object.fromEntries(params);
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    console.error(`Invalid Url Form Data: ${e} from path ${req.nextUrl}`);
    throw e;
  }
}
