import { db } from "@repo/db";
import { subMonths } from "date-fns";
import { z } from "zod/v4";

import parser from "cron-parser";
import { createErrorMap, fromError } from "zod-validation-error/v4";

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

import TransactionsSummary from "@repo/transactional/emails/TransactionsSummary";
import { logger, sendEmail } from "@repo/utils";

import { Worker } from "bullmq";
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

      await sendEmail({
        from: `${school.name} <no-reply@discolaire.com>`,
        react: TransactionsSummary({
          locale: school.defaultLocale,
          school: {
            name: school.name,
            id: school.id,
            logo: school.logo ?? "",
          },
          transactions: transactions.map((transaction) => {
            return {
              id: transaction.id,
              description: transaction.description ?? "",
              name: transaction.account.name ?? "",
              date: transaction.createdAt.toISOString(),
              amount: transaction.amount,
              status: transaction.status,
              currency: school.currency,
              deleted: transaction.deletedAt != null,
            };
          }),
          fullName: user.name,
        }),
        subject: `Résumé des transactions - ${school.name}`,
        to: user.email,
      });
    }
  },
  { connection },
);
