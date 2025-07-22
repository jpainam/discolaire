import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../trpc";

const createUpdateSchema = z.object({
  relationshipId: z.number().optional(),
  livesWith: z.boolean().optional().default(true),
  schoolPickup: z.boolean().optional().default(true),
  emergencyContact: z.boolean().optional().default(true),
  observation: z.string().optional(),
  accessAttendance: z.boolean().optional().default(true),
  accessBilling: z.boolean().optional().default(true),
  accessReportCard: z.boolean().optional().default(true),
  accessScheduling: z.boolean().optional().default(true),
  canAccessData: z.boolean().optional().default(true),
  enablePortalAccess: z.boolean().optional().default(true),
  primaryContact: z.boolean().optional().default(true),
  paysFee: z.boolean().optional().default(true),
});
export const studentContactRouter = {
  delete: protectedProcedure
    .input(z.object({ contactId: z.string(), studentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.studentContact.delete({
        where: {
          studentId_contactId: {
            studentId: input.studentId,
            contactId: input.contactId,
          },
        },
      });
    }),
  get: protectedProcedure
    .input(z.object({ contactId: z.string(), studentId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.studentContact.findUnique({
        where: {
          studentId_contactId: {
            studentId: input.studentId,
            contactId: input.contactId,
          },
        },
        include: {
          contact: true,
          student: true,
          relationship: true,
        },
      });
    }),
  relationships: protectedProcedure.query(({ ctx }) => {
    return ctx.db.contactRelationship.findMany({
      where: {
        schoolId: ctx.schoolId,
      },
      orderBy: {
        id: "asc",
      },
    });
  }),
  create: protectedProcedure
    .input(
      z.object({
        contactId: z.union([z.string(), z.array(z.string())]),
        studentId: z.union([z.string(), z.array(z.string())]),
        data: createUpdateSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const contactIds = Array.isArray(input.contactId)
        ? input.contactId
        : [input.contactId];
      const studentIds = Array.isArray(input.studentId)
        ? input.studentId
        : [input.studentId];

      // Prepare data combinations
      const data = contactIds.flatMap((contactId) =>
        studentIds.map((studentId) => ({
          contactId,
          studentId,
          ...input.data,
        })),
      );

      return ctx.db.studentContact.createMany({ data });
    }),

  update: protectedProcedure
    .input(
      z.object({
        contactId: z.string(),
        studentId: z.string(),
        data: createUpdateSchema,
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.studentContact.update({
        where: {
          studentId_contactId: {
            studentId: input.studentId,
            contactId: input.contactId,
          },
        },
        data: input.data,
      });
    }),
  createRelationship: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.contactRelationship.create({
        data: {
          name: input.name,
          schoolId: ctx.schoolId,
        },
      });
    }),
  updateRelationship: protectedProcedure
    .input(
      z.object({
        id: z.coerce.number(),
        name: z.string().min(1),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.contactRelationship.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
        },
      });
    }),
  deleteRelationship: protectedProcedure
    .input(z.coerce.number())
    .mutation(({ ctx, input }) => {
      return ctx.db.contactRelationship.delete({
        where: {
          id: input,
        },
      });
    }),
} satisfies TRPCRouterRecord;
