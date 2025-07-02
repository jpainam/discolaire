/* eslint-disable no-restricted-properties */
import * as Sentry from "@sentry/nextjs";
let initialized = false;
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "nodejs" && !initialized) {
    const { initializeJobs } = await import("./workers");
    await initializeJobs();
    initialized = true;
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;
