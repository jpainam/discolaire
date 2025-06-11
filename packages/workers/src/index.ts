// packages/worker/src/index.ts
import { Worker } from "bullmq";
import dotenv from "dotenv";

dotenv.config();

import { getRedis } from "./utils";
const connection = getRedis();
const worker = new Worker(
  "my-queue",
  async (job) => {
    console.log(`Processing job ${job.id}`, job.data);
    // your logic here
  },
  { connection },
);

worker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed: ${err.message}`);
});
