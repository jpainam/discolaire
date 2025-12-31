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
        pageIndex: z.number().default(1),
        limit: z.number().default(10),
        startAfter: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const objects = await listS3Objects({
        bucket: env.S3_AVATAR_BUCKET_NAME,
        prefix: "student/",
        startAfter: input.startAfter,
      });
      const studentIds: string[] = [];
      const objByStudentId = new Map<string, (typeof objects)[number]>();
      for (const obj of objects) {
        const an_id = extractId(obj.key);
        if (an_id) {
          studentIds.push(an_id);
          objByStudentId.set(an_id, obj);
        }
      }
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
        take: input.limit,
        orderBy: {
          updatedAt: "desc",
        },

        where: {
          OR: [
            {
              id: {
                in: studentIds,
              },
            },
            {
              registrationNumber: {
                in: studentIds,
              },
            },
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
