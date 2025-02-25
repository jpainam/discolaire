import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

// https://bible-api.com/?random=verse
const bibleVerseSchema = z.object({
  reference: z.string(),
  verses: z.array(
    z.object({
      book_id: z.string(),
      book_name: z.string(),
      chapter: z.number(),
      verse: z.number(),
      text: z.string(),
    }),
  ),
  text: z.string(),
  translation_id: z.string(),
  translation_name: z.string(),
  translation_note: z.string(),
});

export const bibleRouter = createTRPCRouter({
  random: publicProcedure.query(async () => {
    try {
      const response = await fetch("https://bible-api.com/?random=verse");

      const result = await response.json();
      const parsed = bibleVerseSchema.safeParse(result);
      if (!parsed.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch random verse",
        });
      }
      const { data } = parsed;
      const verse = data.verses.length > 0 ? data.verses[0] : null;
      const book = `${verse?.book_name} ${verse?.chapter}:${verse?.verse}`;
      return { verse: verse?.text, book };
    } catch (e) {
      console.error(e);
      return { verse: null, book: null };
    }
  }),
  updateMatricule: publicProcedure.mutation(async ({ ctx }) => {
    const students = await ctx.db.student.findMany({
      where: {
        schoolId: "cm1hbntgn00001h578bvyjxln",
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    let startMatric = 2512001;
    for (const student of students) {
      await ctx.db.student.update({
        where: {
          id: student.id,
        },
        data: {
          registrationNumber: startMatric.toString(),
        },
      });
      startMatric++;
    }
  }),
});
