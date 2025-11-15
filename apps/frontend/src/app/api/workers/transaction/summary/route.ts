import cron from "node-cron";
import z from "zod/v4";

import { getSession } from "~/auth/server";
import { env } from "~/env";
import { getQueryClient, trpc } from "~/trpc/server";
import { isValidCron } from "~/utils/worker";

const dataSchema = z.object({
  name: z.string().min(1),
  schoolYearId: z.string().min(1),
  schoolId: z.string().min(1),
  cron: z.string().min(1),
  userId: z.string().min(1),
  taskId: z.number(),
});

export async function GET() {
  const session = await getSession();
  if (!session) {
    return new Response("Not authorized", { status: 401 });
  }
  const queryClient = getQueryClient();

  const tasks = await queryClient.fetchQuery(
    trpc.scheduleTask.byName.queryOptions({
      name: "transaction-summary",
    }),
  );
  for (const task of tasks) {
    if (!isValidCron(task.cron)) {
      console.error(
        `Invalid cron pattern for task ${task.id} ${task.name}: ${task.cron}`,
      );
      continue;
    }
    const { staffId } = task.data as { staffId?: string | undefined };
    if (!staffId) {
      console.error(`No staffId found for task ${task.id} ${task.name}`);
      continue;
    }
    const staff = await queryClient.fetchQuery(
      trpc.staff.get.queryOptions(staffId),
    );

    if (!staff.userId) {
      console.error(
        `No userId found for staff ${staffId} for task ${task.id} ${task.name}`,
      );
      continue;
    }
    const school = await queryClient.fetchQuery(
      trpc.school.get.queryOptions(task.schoolId),
    );
    console.log(school);

    const values = {
      name: task.name,
      schoolYearId: task.schoolYearId,
      schoolId: task.schoolId,
      userId: staff.userId,
      cron: task.cron,
      taskId: task.id,
    };
    const parsed = dataSchema.safeParse(values);
    if (!parsed.success) {
      const validationError = z.treeifyError(parsed.error);
      console.error(
        `Invalid job data for task ${task.id} ${task.name}: ${JSON.stringify(validationError)}`,
      );
      continue;
    }
    const data = parsed.data;
    cron.schedule(task.cron, () => {
      console.log(
        `running a task for ${task.cron} with ${JSON.stringify(data)}`,
      );
      runJob({
        schoolYearId: data.schoolYearId,
        schoolId: data.schoolId,
        userId: data.userId,
      }).catch((err) => console.error(err));
    });
    //   await jobQueue.add(JobNames.TRANSACTION_SUMMARY, data, {
    //     repeat: {
    //       pattern: task.cron,
    //       //pattern: "* * * * *", // Every minute for testing
    //       tz: school.timezone,
    //     },
    //     jobId: `${task.id}-${staffId}-${task.name}`, // prevents duplicates
    //   });
    console.info(
      `[Scheduler] Transaction Summary, taskId: ${task.id}, cron ${task.cron}`,
    );
  }
}

async function runJob(result: {
  schoolYearId: string;
  schoolId: string;
  userId: string;
}) {
  const { schoolId, userId, schoolYearId } = result;
  await fetch(`${env.NEXT_PUBLIC_BASE_URL}/api/emails/transaction/summary`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": env.DISCOLAIRE_API_KEY,
      Cookie: `x-school-year=${schoolYearId}`,
    },

    body: JSON.stringify({
      schoolId: schoolId,
      userId: userId,
      schoolYearId: schoolYearId,
      //startDate: startDate,
      //endDate: endDate,
    }),
  });
}
