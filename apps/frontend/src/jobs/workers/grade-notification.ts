import { createErrorMap, fromError } from "zod-validation-error/v4";
import { z } from "zod/v4";

z.config({
  customError: createErrorMap({
    includePath: true,
  }),
});

import { logger } from "@repo/utils";

import { db } from "@repo/db";
import { Worker } from "bullmq";
import { JobNames } from "../job-names";
import { jobQueueName } from "../queue";
import { getRedis } from "../redis-client";

z.config({
  customError: createErrorMap({
    includePath: true,
  }),
});

const newGradeSchema = z.object({
  gradeSheetId: z.coerce.number(),
});
const connection = getRedis();
logger.log("[Worker] Initializing new grade notification worker");
new Worker(
  jobQueueName,
  async (job) => {
    if (job.name === JobNames.NEW_GRADE_NOTIFICATION) {
      const result = newGradeSchema.safeParse(job.data);
      if (!result.success) {
        const validationError = fromError(result.error);
        throw new Error(`${job.id} ${validationError.message}`);
      }
      const { gradeSheetId } = result.data;
      const gradesheet = await db.gradeSheet.findUniqueOrThrow({
        include: {
          term: true,
          subject: {
            include: {
              course: true,
            },
          },
          grades: {
            include: {
              student: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
        where: { id: gradeSheetId },
      });
      const userIds = gradesheet.grades
        .map((g) => g.student.user?.id)
        .filter((id): id is string => id !== undefined);
      const title = `[Notes] ${gradesheet.subject.course.name}`;
      const message = `Nouvelle saisie des notes ${gradesheet.name}. Veuillez vérifier vos notes pour plus de détails.`;
      const data = [];
      const adminUsers = await db.user.findMany({
        where: {
          role: "admin",
        },
      });
      userIds.push(...adminUsers.map((user) => user.id));

      for (const userId of userIds) {
        data.push({
          userId: userId,
          title,
          message,
          schoolYearId: gradesheet.term.schoolYearId,
        });
      }
      await db.userNotification.createMany({
        data: data,
      });
    }
  },
  { connection },
);
