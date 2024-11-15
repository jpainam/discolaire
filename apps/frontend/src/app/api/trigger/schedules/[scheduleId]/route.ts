import { db } from "@repo/db";
import { schedules } from "@repo/jobs";

export async function DELETE(
  _request: Request,
  { scheduleId }: { scheduleId: number },
) {
  const job = await db.scheduleJob.findUniqueOrThrow({
    where: {
      id: scheduleId,
    },
  });
  await schedules.del(job.triggerDevId);

  await db.scheduleJob.delete({
    where: {
      id: scheduleId,
    },
  });
  console.log("Deleted schedule", job);
  return new Response(null, { status: 204 });
}
