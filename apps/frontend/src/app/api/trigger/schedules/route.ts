import { z } from "zod";

import { db } from "@repo/db";
import { schedules, transactionSummary } from "@repo/jobs";

const schema = z.object({
  timezone: z.string().min(1),
  userId: z.string().min(1),
  type: z.enum(["transaction-summary", "deleted-transaction"]),
  cron: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const result = schema.safeParse(data);
    if (!result.success) {
      return new Response("Invalid input", { status: 400 });
    }
    const { timezone, userId, cron, type } = result.data;
    let taskId = "";
    switch (type) {
      case "transaction-summary":
        taskId = transactionSummary.id;
        break;
      default:
        return new Response("Invalid type", { status: 400 });
    }
    const createdSchedule = await schedules.create({
      task: taskId,
      cron: cron,
      timezone: timezone,
      externalId: userId,
      deduplicationKey: `${userId}-reminder`,
    });

    await db.scheduleJob.create({
      data: {
        type: type,
        userId: userId,
        cron: cron,
        timezone: timezone,
        triggerDevId: createdSchedule.id,
      },
    });
    return Response.json(createdSchedule);
  } catch (e) {
    console.error(e);
    return new Response("Error creating schedule", { status: 500 });
  }
}
