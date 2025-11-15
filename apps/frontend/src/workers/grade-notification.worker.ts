/* eslint-disable @typescript-eslint/no-unused-vars */
import { Worker } from "bullmq";
import { z } from "zod/v4";

import { caller } from "~/trpc/server";
import { logger } from "~/utils/logger";
import { JobNames, jobQueueName } from "./queue";
import { getRedis } from "./redis-client";

const newGradeSchema = z.object({
  gradeSheetId: z.coerce.number(),
});
const connection = getRedis();
logger.info("[Worker] Grade notification worker initialized");
new Worker(
  jobQueueName,
  async (job) => {
    if (job.name === JobNames.NEW_GRADE_NOTIFICATION) {
      const result = newGradeSchema.safeParse(job.data);
      if (!result.success) {
        const error = z.treeifyError(result.error);
        throw new Error(`${job.id} ${JSON.stringify(error)}`);
      }
      const { gradeSheetId } = result.data;
      const gradesheet = await caller.gradeSheet.get(gradeSheetId);
      const grades = await caller.gradeSheet.grades(gradeSheetId);

      const userIds = grades
        .map((g) => g.student.user?.id)
        .filter((id): id is string => id !== undefined);
      const title = `[Notes] ${gradesheet.subject.course.name}`;
      const message = `Nouvelle saisie des notes ${gradesheet.name}. Veuillez vérifier vos notes pour plus de détails.`;
      const data = [];

      // const adminUsers = await db.user.findMany({
      //   where: {
      //     role: "admin",
      //   },
      // });
      // userIds.push(...adminUsers.map((user) => user.id));

      // for (const userId of userIds) {
      //   data.push({
      //     userId: userId,
      //     title,
      //     message,
      //     schoolYearId: gradesheet.term.schoolYearId,
      //   });
      // }
      // await db.userNotification.createMany({
      //   data: data,
      // });
    }
  },
  { connection },
);
