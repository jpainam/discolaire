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
  studentId: z.string().min(1),
  hasAdd: z.boolean().default(false),
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
  hasEpilepsy: z.boolean().default(false),
  epilepsyNotes: z.string().optional(),
  frequentHeadaches: z.boolean().default(false),
  frequentHeadachesNotes: z.string().optional(),
  hasHeadInjuries: z.boolean().default(false),
  headInjuriesNotes: z.string().optional(),
  hasHeartIssues: z.boolean().default(false),
  heartIssuesNotes: z.string().optional(),
  hasHearingLoss: z.boolean().default(false),
  hearingLossNotes: z.string().optional(),
  hasSeizures: z.boolean().default(false),
  seizuresNotes: z.string().optional(),
  hasHandicap: z.boolean().default(false),
  handicapNotes: z.string().optional(),
  hasSkinProblems: z.boolean().default(false),
  skinProblemsNotes: z.string().optional(),
  hasVisionProblems: z.boolean().default(false),
  visionProblemsNotes: z.string().optional(),
  hasUrinaryProblems: z.boolean().default(false),
  urinaryProblemsNotes: z.string().optional(),
  hospitalizationIssues: z.boolean().default(false),
  hospitalizationNotes: z.string().optional(),
  internalObservations: z.string().optional(),
  observations: z.string().optional(),
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
        userId: z.string().nullable(),
      }),
    )
    .query(({ ctx, input }) => {
      if (!input.userId) {
        return [];
      }
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
  drugs: protectedProcedure
    .input(z.object({ studentId: z.string().min(1) }))
    .query(({ ctx, input }) => {
      return ctx.db.healthDrug.findMany({
        where: {
          studentId: input.studentId,
        },
      });
    }),
  createDrug: protectedProcedure
    .input(
      z.object({
        studentId: z.string().min(1),
        name: z.string().min(1),
        dosage: z.string().min(1),
        description: z.string().min(1),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.healthDrug.create({
        data: {
          studentId: input.studentId,
          name: input.name,
          dosage: input.dosage,
          description: input.description,
        },
      });
    }),
  deleteDrug: protectedProcedure
    .input(z.coerce.number())
    .mutation(({ ctx, input }) => {
      return ctx.db.healthDrug.delete({
        where: {
          id: input,
        },
      });
    }),
  updateDrug: protectedProcedure
    .input(
      z.object({
        id: z.coerce.number(),
        name: z.string().min(1),
        dosage: z.string().min(1),
        description: z.string().min(1),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.healthDrug.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          dosage: input.dosage,
          description: input.description,
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
