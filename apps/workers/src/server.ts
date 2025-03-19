// packages/worker/src/server.ts
//import { createBullBoard } from "@bull-board/api";
//import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { Queue } from "bullmq";
import IORedis from "ioredis";

// Redis connection
const connection = new IORedis(`${process.env.REDIS_URL}?family=0`, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

// Define queues (same as your worker queues)
export const emailQueue = new Queue("email", { connection });
export const smsQueue = new Queue("sms", { connection });
export const logQueue = new Queue("log", { connection });

// Setup Bull Board
// export const { router } = createBullBoard([
//   new BullMQAdapter(emailQueue),
//   new BullMQAdapter(smsQueue),
//   new BullMQAdapter(logQueue),
// ]);

// // Express app
// const app = express();
// app.use("/admin/queues", router);

// const PORT = 3005;
// app.listen(PORT, () => {
//   console.log(`Bull Board running at http://localhost:${PORT}/admin/queues`);
// });
