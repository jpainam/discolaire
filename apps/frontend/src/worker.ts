/**
 * Standalone worker process — run independently from the Next.js server.
 *
 * Usage (from apps/frontend):
 *   pnpm with-env node --experimental-strip-types src/worker.ts
 *   or with tsx:
 *   pnpm with-env tsx src/worker.ts
 */
import "./workers/email-notification.worker";
import "./workers/db-backup.worker";

import { initializeJobs } from "./workers";

console.log("[Worker] Starting standalone worker process...");

await initializeJobs();

console.log("[Worker] All workers running. Waiting for jobs...");

// Keep the process alive
process.on("SIGTERM", () => {
  console.log("[Worker] Received SIGTERM, shutting down gracefully...");
  process.exit(0);
});
