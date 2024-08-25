import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

const healthVisitSchema = z.object({
  date: z.coerce.date().default(() => new Date()),
  complaint: z.string(),
  signs: z.string().optional(),
  examination: z.string().optional(),
  assessment: z.string().optional(),
  plan: z.string().optional(),
  attachments: z.array(z.string()).optional(),
});

export const healthRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  visit: protectedProcedure.input(healthVisitSchema).mutation(async () => {
    // return ctx.db.healthVisit.create({
    //   data: {
    //     date: new Date(),
    //     complaint: "headache",
    //   },
    // });
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
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.fee.delete({ where: { id: input.id } });
    }),
});
