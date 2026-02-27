import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { env } from "../env";
import { protectedProcedure } from "../trpc";

const createUpdateSchema = z.object({
  contactId: z.string(),
  studentId: z.string(),
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
    .input(createUpdateSchema.array())
    .mutation(async ({ ctx, input }) => {
      const created = await ctx.db.studentContact.createMany({
        data: input,
        skipDuplicates: true,
      });
      const contactIds = Array.from(
        new Set(input.map((item) => item.contactId)),
      );
      await ctx.services.billing.syncAutoDiscountAssignmentsForContacts({
        contactIds,
        schoolId: ctx.schoolId,
        schoolYearId: ctx.schoolYearId,
      });

      // Fire-and-forget: notify each linked contact by email via the Next.js email API route
      void Promise.all(
        input.map((item) =>
          fetch(`${ctx.baseUrl}/api/emails/student-contact/link`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": env.DISCOLAIRE_API_KEY,
            },
            body: JSON.stringify({
              tenant: ctx.tenant,
              studentId: item.studentId,
              contactId: item.contactId,
              relationshipId: item.relationshipId,
            }),
          }),
        ),
      ).catch((err) => {
        console.error("[studentContact.create] email error:", err);
      });

      return created;
    }),

  update: protectedProcedure
    .input(createUpdateSchema.array())
    .mutation(async ({ ctx, input }) => {
      const updates = input.map((item) => {
        const { contactId, studentId, ...data } = item;
        return ctx.db.studentContact.update({
          where: {
            studentId_contactId: {
              studentId,
              contactId,
            },
          },
          data,
        });
      });

      const result = await Promise.all(updates);
      const contactIds = Array.from(
        new Set(input.map((item) => item.contactId)),
      );
      await ctx.services.billing.syncAutoDiscountAssignmentsForContacts({
        contactIds,
        schoolId: ctx.schoolId,
        schoolYearId: ctx.schoolYearId,
      });
      return result;
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
  fromStudent: protectedProcedure
    .input(
      z.object({
        studentIds: z.string().array(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.studentContact.findMany({
        where: {
          studentId: {
            in: input.studentIds,
          },
        },
        include: {
          contact: true,
        },
      });
    }),
} satisfies TRPCRouterRecord;
