import { Worker } from "bullmq";
import parser from "cron-parser";
import { createErrorMap, fromError } from "zod-validation-error/v4";
import { z } from "zod/v4";

import { db } from "@repo/db";
import { logger } from "@repo/utils";

import { env } from "~/env";
import { JobNames, jobQueue, jobQueueName } from "./queue";
import { getRedis } from "./redis-client";

z.config({
  customError: createErrorMap({
    includePath: true,
  }),
});
const dataSchema = z.object({
  name: z.string().min(1),
  schoolYearId: z.string().min(1),
  schoolId: z.string().min(1),
  cron: z.string().min(1),
  userId: z.string().min(1),
  taskId: z.number(),
});

const connection = getRedis();
logger.info("[Worker] Transaction summary worker initialized");
new Worker(
  jobQueueName,
  async (job) => {
    if (job.name === JobNames.TRANSACTION_SUMMARY) {
      const result = dataSchema.safeParse(job.data);
      if (!result.success) {
        const validationError = fromError(result.error);
        throw new Error(
          `Invalid job data for job ${job.id} ${validationError.message}`,
        );
      }

      const { cron, schoolId, userId, schoolYearId } = result.data;

      const user = await db.user.findUniqueOrThrow({
        where: {
          id: userId,
        },
      });
      if (!user.email) {
        logger.error(`User ${userId} does not have an email address`);
        return;
      }

      const school = await db.school.findUniqueOrThrow({
        where: {
          id: schoolId,
        },
      });
      const interval = parser.parseExpression(cron);
      const startDate = interval.prev().toDate();
      const endDate = new Date();

      const response = await fetch(
        `${env.NEXT_PUBLIC_BASE_URL}/api/emails/transaction/summary`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": env.DISCOLAIRE_API_KEY,
            Cookie: `x-school-year=${schoolYearId}`,
          },

          body: JSON.stringify({
            schoolId: school.id,
            userId: user.id,
            schoolYearId: schoolYearId,
            startDate: startDate,
            endDate: endDate,
          }),
        },
      );
      if (!response.ok) {
        const errorText = await response.text();
        logger.error(
          `Failed to send transaction summary email for user ${user.id}: ${errorText}`,
        );
        throw new Error(
          `Failed to send transaction summary email: ${errorText}`,
        );
      }
    }
  },
  { connection },
);

function isValidCron(cron: string): boolean {
  try {
    parser.parseExpression(cron);
    return true;
  } catch {
    return false;
  }
}

export async function scheduleTransactionSummaryNofication() {
  const tasks = await db.scheduleTask.findMany({
    where: {
      name: "transaction-summary",
    },
  });
  for (const task of tasks) {
    if (!isValidCron(task.cron)) {
      logger.error(
        `Invalid cron pattern for task ${task.id} ${task.name}: ${task.cron}`,
      );
      continue;
    }
    const { staffId } = task.data as { staffId?: string | undefined };
    if (!staffId) {
      logger.error(`No staffId found for task ${task.id} ${task.name}`);
      continue;
    }
    const staff = await db.staff.findUnique({
      where: {
        id: staffId,
      },
    });
    if (!staff?.userId) {
      logger.error(
        `No userId found for staff ${staffId} for task ${task.id} ${task.name}`,
      );
      continue;
    }
    const school = await db.school.findUniqueOrThrow({
      where: {
        id: task.schoolId,
      },
    });
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
      const validationError = fromError(parsed.error);
      logger.error(
        `Invalid job data for task ${task.id} ${task.name}: ${validationError.message}`,
      );
      continue;
    }
    const data = parsed.data;
    await jobQueue.add(JobNames.TRANSACTION_SUMMARY, data, {
      repeat: {
        pattern: task.cron,
        //pattern: "* * * * *", // Every minute for testing
        tz: school.timezone,
      },
      jobId: `${task.id}-${staffId}-${task.name}`, // prevents duplicates
    });
    logger.info(
      `[Scheduler] Transaction Summary, taskId: ${task.id}, cron ${task.cron}`,
    );
  }
}
