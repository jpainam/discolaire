import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { env } from "../env";
import { getObjectStat, listS3Objects } from "../services/s3-client";
import { protectedProcedure } from "../trpc";

function extractId(path: string): string | null {
  const match = /(?:^|\/)([0-9a-fA-F-]{36})\.(?:png|jpe?g)$/.exec(path);
  return match?.[1] ?? null;
}

type S3Object = Awaited<ReturnType<typeof listS3Objects>>[number];

function filterByDateRange(
  objects: S3Object[],
  dateFrom: string | undefined,
  dateTo: string | undefined,
): S3Object[] {
  if (!dateFrom && !dateTo) return objects;
  const from = dateFrom ? new Date(dateFrom) : null;
  const to = dateTo ? new Date(dateTo + "T23:59:59.999Z") : null;
  return objects.filter((obj) => {
    if (!obj.lastModified) return true;
    if (from && obj.lastModified < from) return false;
    if (to && obj.lastModified > to) return false;
    return true;
  });
}

function buildObjMap(objects: S3Object[]): {
  ids: string[];
  map: Map<string, S3Object>;
} {
  const ids: string[] = [];
  const map = new Map<string, S3Object>();
  for (const obj of objects) {
    const id = extractId(obj.key);
    if (id) {
      ids.push(id);
      map.set(id, obj);
    }
  }
  return { ids, map };
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
      const objects = filterByDateRange(allObjects, input.dateFrom, input.dateTo);
      const { ids: studentIds, map: objByStudentId } = buildObjMap(objects);

      const skip = (input.pageIndex - 1) * input.limit;
      const searchConditions = input.q
        ? [
            {
              OR: [
                { firstName: { contains: input.q, mode: "insensitive" as const } },
                { lastName: { contains: input.q, mode: "insensitive" as const } },
                { registrationNumber: { contains: input.q, mode: "insensitive" as const } },
              ],
            },
          ]
        : [];
      const classroomConditions = input.classroomId
        ? [
            {
              enrollments: {
                some: {
                  classroom: { id: input.classroomId, schoolYearId: ctx.schoolYearId },
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
          enrollments: { select: { classroom: true } },
        },
        skip,
        take: input.limit,
        orderBy: { updatedAt: "desc" },
        where: {
          AND: [
            { OR: [{ id: { in: studentIds } }, { registrationNumber: { in: studentIds } }] },
            ...searchConditions,
            ...classroomConditions,
          ],
        },
      });
      return students.map((s) => {
        const obj =
          objByStudentId.get(s.id) ??
          (s.registrationNumber ? objByStudentId.get(s.registrationNumber) : undefined);
        return {
          ...s,
          classroom: s.enrollments.find(
            (enr) => enr.classroom.schoolYearId == ctx.schoolYearId,
          )?.classroom,
          ...obj,
        };
      });
    }),
  contacts: protectedProcedure
    .input(
      z.object({
        q: z.string().optional(),
        dateFrom: z.string().optional(),
        dateTo: z.string().optional(),
        pageIndex: z.number().default(1),
        limit: z.number().default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      const allObjects = await listS3Objects({
        bucket: env.S3_AVATAR_BUCKET_NAME,
        prefix: "contact/",
      });
      const objects = filterByDateRange(allObjects, input.dateFrom, input.dateTo);
      const { ids: contactIds, map: objByContactId } = buildObjMap(objects);

      const skip = (input.pageIndex - 1) * input.limit;
      const searchConditions = input.q
        ? [
            {
              OR: [
                { firstName: { contains: input.q, mode: "insensitive" as const } },
                { lastName: { contains: input.q, mode: "insensitive" as const } },
              ],
            },
          ]
        : [];
      const contacts = await ctx.db.contact.findMany({
        select: {
          id: true,
          lastName: true,
          firstName: true,
          occupation: true,
        },
        skip,
        take: input.limit,
        orderBy: { updatedAt: "desc" },
        where: {
          AND: [
            { id: { in: contactIds } },
            ...searchConditions,
          ],
        },
      });
      return contacts.map((c) => ({
        ...c,
        ...objByContactId.get(c.id),
      }));
    }),
  staffs: protectedProcedure
    .input(
      z.object({
        q: z.string().optional(),
        dateFrom: z.string().optional(),
        dateTo: z.string().optional(),
        pageIndex: z.number().default(1),
        limit: z.number().default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      const allObjects = await listS3Objects({
        bucket: env.S3_AVATAR_BUCKET_NAME,
        prefix: "staff/",
      });
      const objects = filterByDateRange(allObjects, input.dateFrom, input.dateTo);
      const { ids: staffIds, map: objByStaffId } = buildObjMap(objects);

      const skip = (input.pageIndex - 1) * input.limit;
      const searchConditions = input.q
        ? [
            {
              OR: [
                { firstName: { contains: input.q, mode: "insensitive" as const } },
                { lastName: { contains: input.q, mode: "insensitive" as const } },
                { jobTitle: { contains: input.q, mode: "insensitive" as const } },
              ],
            },
          ]
        : [];
      const staffs = await ctx.db.staff.findMany({
        select: {
          id: true,
          lastName: true,
          firstName: true,
          jobTitle: true,
        },
        skip,
        take: input.limit,
        orderBy: { updatedAt: "desc" },
        where: {
          AND: [
            { id: { in: staffIds } },
            ...searchConditions,
          ],
        },
      });
      return staffs.map((s) => ({
        ...s,
        ...objByStaffId.get(s.id),
      }));
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
