import { z } from "zod";

import { schedules, transactionSummary } from "@repo/jobs";

const schema = z.object({
  timezone: z.string().min(1),
  userId: z.string().min(1),
  cron: z.string().min(1),
});

export async function POST(request: Request) {
  const data = await request.json();
  const result = schema.safeParse(data);
  if (!result.success) {
    return new Response("Invalid input", { status: 400 });
  }
  const { timezone, userId, cron } = result.data;
  const createdSchedule = await schedules.create({
    task: transactionSummary.id,
    cron: cron,
    timezone: timezone,
    externalId: userId,
    deduplicationKey: `${userId}-reminder`,
  });
  return Response.json(createdSchedule);
}
