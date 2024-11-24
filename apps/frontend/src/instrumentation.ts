//import { env } from "./env";

// https://github.com/orgs/vercel/discussions/5050
export async function register() {
  // eslint-disable-next-line no-restricted-properties
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { initializeJobs } = await import("@repo/jobs");
    await initializeJobs().catch(console.error);

    const { Worker } = await import("bullmq");
    const { jobQueue, queueName } = await import("@repo/jobs/queue");
    const { jobWorker } = await import("@repo/jobs/worker");

    // Create a new worker to process jobs from the queue
    const worker = new Worker(queueName, jobWorker, {
      connection: jobQueue.opts.connection,
    });

    worker.on("completed", (job) => {
      console.log(`Job completed for ${job.id}`);
    });
    worker.on("failed", (job, err) => {
      console.error(`${job?.id} Worker failed ${err.message}`);
    });
    worker.on("stalled", (str) => {
      console.log(`Job stalled: ${str}`);
    });
    console.log("Worker started");
  }
}
