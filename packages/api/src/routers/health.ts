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

const issueSchema = z.object({
  hasADD: z.boolean().default(false),
  studentId: z.string().min(1),
  addNotes: z.string().optional(),
  hasAllergies: z.boolean().default(false),
  allergyFood: z.boolean().default(false),
  allergyInsectStings: z.boolean().default(false),
  allergyPollen: z.boolean().default(false),
  allergyAnimals: z.boolean().default(false),
  allergyMedications: z.boolean().default(false),
  allergyNotes: z.string().optional(),
  usesEpiPenAtSchool: z.boolean().optional(),
  hasAsthma: z.boolean().default(false),
  asthmaNotes: z.string().optional(),
  inhalerAtSchool: z.boolean().optional(),
  hasMobilityIssues: z.boolean().default(false),
  mobilityNotes: z.string().optional(),
  hasDiabetes: z.boolean().default(false),
  diabetesNotes: z.string().optional(),
  needsInsulinOrGlucometer: z.boolean().optional(),
  hasEarThroatInfections: z.boolean().default(false),
  earThroatNotes: z.string().optional(),
  hasEmotionalIssues: z.boolean().default(false),
  emotionalNotes: z.string().optional(),
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
  updateIssues: protectedProcedure
    .input(issueSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.healthRecord.upsert({
        where: {
          studentId: input.studentId,
        },
        update: {
          ...input,
        },
        create: {
          ...input,
        },
      });
    }),
  issues: protectedProcedure
    .input(z.string().min(1))
    .query(({ ctx, input }) => {
      return ctx.db.healthRecord.findFirst({
        where: {
          studentId: input,
        },
      });
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
