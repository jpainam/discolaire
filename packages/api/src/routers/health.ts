import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

const healthVisitSchema = z.object({
  date: z.coerce.date().default(() => new Date()),
  complaint: z.string(),
  signs: z.string().optional(),
  examination: z.string().optional(),
  assessment: z.string().optional(),
  plan: z.string().optional(),
  userId: z.string().min(1),
  attachments: z.array(z.string()).default([]),
});

export const healthRouter = createTRPCRouter({
  createVisit: protectedProcedure
    .input(healthVisitSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.healthVisit.create({
        data: {
          date: input.date,
          complaint: input.complaint,
          signs: input.signs,
          userId: input.userId,
          createdById: ctx.session.user.id,
          examination: input.examination,
          assessment: input.assessment,
          plan: input.plan,
          attachments: input.attachments,
        },
      });
    }),
  visits: protectedProcedure
    .input(
      z.object({
        userId: z.string().min(1),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.healthVisit.findMany({
        where: {
          userId: input.userId,
        },
      });
    }),
  issues: protectedProcedure.query(() => {
    return [
      "ADD_ADHD",
      "ALLERGIES",
      "ASTHMA",
      "MUSCLE_CONDITION",
      "DIABETES",
      "EAR_THROAT_INFECTIONS",
      "EMOTIONAL_PROBLEMS",
      "FAINTING",
      "HEADACHES",
    ];
  }),
  documents: protectedProcedure
    .input(
      z.object({
        userId: z.string().min(1),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.healthVisit.findMany({
        where: {
          userId: input.userId,
        },
      });
    }),
  deleteVisit: protectedProcedure
    .input(z.string().min(1))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.healthVisit.delete({ where: { id: input } });
    }),
});
