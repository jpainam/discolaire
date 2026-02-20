import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { env } from "../env";
import { getObjectStat, listS3Objects } from "../services/s3-client";
import { protectedProcedure } from "../trpc";

function extractId(path: string): string | null {
  const match = /(?:^|\/)([0-9a-fA-F-]{36})\.(?:png|jpe?g)$/.exec(path);
  return match?.[1] ?? null;
}

export const photoRouter = {
  listObjects: protectedProcedure
    .input(
      z.object({
        startAfter: z.string().optional(),
        prefix: z.string(),
        bucket: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return listS3Objects({
        bucket: input.bucket,
        prefix: input.prefix,
        startAfter: input.startAfter,
      });
    }),
  students: protectedProcedure
    .input(
      z.object({
        q: z.string().optional(),
        classroomId: z.string().optional(),
        dateFrom: z.string().optional(),
        dateTo: z.string().optional(),
        pageIndex: z.number().default(1),
        limit: z.number().default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      const allObjects = await listS3Objects({
        bucket: env.S3_AVATAR_BUCKET_NAME,
        prefix: "student/",
      });

      // Filter S3 objects by photo lastModified date range
      const dateFrom = input.dateFrom ? new Date(input.dateFrom) : null;
      const dateTo = input.dateTo
        ? new Date(input.dateTo + "T23:59:59.999Z")
        : null;
      const objects =
        dateFrom ?? dateTo
          ? allObjects.filter((obj) => {
              if (!obj.lastModified) return true;
              if (dateFrom && obj.lastModified < dateFrom) return false;
              if (dateTo && obj.lastModified > dateTo) return false;
              return true;
            })
          : allObjects;

      const studentIds: string[] = [];
      const objByStudentId = new Map<string, (typeof objects)[number]>();
      for (const obj of objects) {
        const an_id = extractId(obj.key);
        if (an_id) {
          studentIds.push(an_id);
          objByStudentId.set(an_id, obj);
        }
      }
      const skip = (input.pageIndex - 1) * input.limit;
      const searchConditions = input.q
        ? [
            {
              OR: [
                {
                  firstName: { contains: input.q, mode: "insensitive" as const },
                },
                {
                  lastName: { contains: input.q, mode: "insensitive" as const },
                },
                {
                  registrationNumber: {
                    contains: input.q,
                    mode: "insensitive" as const,
                  },
                },
              ],
            },
          ]
        : [];
      const classroomConditions = input.classroomId
        ? [
            {
              enrollments: {
                some: {
                  classroom: {
                    id: input.classroomId,
                    schoolYearId: ctx.schoolYearId,
                  },
                },
              },
            },
          ]
        : [];
      const students = await ctx.db.student.findMany({
        select: {
          id: true,
          lastName: true,
          firstName: true,
          registrationNumber: true,
          enrollments: {
            select: {
              classroom: true,
            },
          },
        },
        skip,
        take: input.limit,
        orderBy: {
          updatedAt: "desc",
        },
        where: {
          AND: [
            {
              OR: [
                { id: { in: studentIds } },
                { registrationNumber: { in: studentIds } },
              ],
            },
            ...searchConditions,
            ...classroomConditions,
          ],
        },
      });
      return students.map((s) => {
        const obj =
          objByStudentId.get(s.id) ??
          (s.registrationNumber
            ? objByStudentId.get(s.registrationNumber)
            : undefined);
        return {
          ...s,
          classroom: s.enrollments.find(
            (enr) => enr.classroom.schoolYearId == ctx.schoolYearId,
          )?.classroom,
          ...obj,
        };
      });
    }),
  getFromKey: protectedProcedure
    .input(
      z.object({
        key: z.string(),
        profile: z.enum(["student", "contact", "staff"]),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (input.profile == "staff") {
        const staff = await ctx.db.staff.findFirst({
          where: {
            avatar: input.key,
          },
        });
        return { id: staff?.id };
      } else if (input.profile == "contact") {
        const contact = await ctx.db.contact.findFirst({
          where: {
            avatar: input.key,
          },
        });
        return { id: contact?.id };
      } else {
        const student = await ctx.db.student.findFirst({
          where: {
            avatar: input.key,
          },
        });
        return { id: student?.id };
      }
    }),
  get: protectedProcedure
    .input(
      z.object({
        key: z.string(),
        type: z.enum(["avatar", "image"]),
      }),
    )
    .query(async ({ input }) => {
      const bucket = input.type == "avatar" ? env.S3_AVATAR_BUCKET_NAME : "";
      const obj = await getObjectStat({ key: input.key, bucket });
      return obj;
    }),
  // getUserByKey: protectedProcedure
  //   .input(z.object({ key: z.string() }))
  //   .query(({ ctx, input }) => {
  //     return ctx.db.user.findFirst({
  //       where: {
  //         avatar: input.key,
  //       },
  //     });
  //   }),
} satisfies TRPCRouterRecord;
