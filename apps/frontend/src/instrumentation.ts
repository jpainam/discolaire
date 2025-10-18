let initialized = false;
export async function register() {
  // eslint-disable-next-line no-restricted-properties
  if (process.env.NEXT_RUNTIME === "nodejs" && !initialized) {
    const { initializeJobs } = await import("./workers");
    await initializeJobs();
    initialized = true;
  }
}
