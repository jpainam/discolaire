import { db } from "@repo/db";
import parser from "cron-parser";
import { subMonths } from "date-fns";
import { createErrorMap, fromError } from "zod-validation-error/v4";
import { z } from "zod/v4";

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

import { logger } from "@repo/utils";

import { Worker } from "bullmq";
import { env } from "~/env";
import { JobNames } from "../job-names";
import { jobQueueName } from "../queue";
import { getRedis } from "../redis-client";

const connection = getRedis();
logger.log("[Worker] Initializing transaction summary worker");
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
      const transactions = await db.transaction.findMany({
        include: {
          account: true,
        },
        where: {
          AND: [
            { schoolYearId: schoolYearId },
            {
              createdAt: {
                gte: subMonths(startDate, 3),
                lte: endDate,
              },
            },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      const response = await fetch(
        `${env.NEXT_PUBLIC_BASE_URL}/api/emails/transaction/summary`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": env.DISCOLAIRE_API_KEY,
          },
          body: JSON.stringify({
            schoolId: school.id,
            userId: user.id,
            transactions: transactions,
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
