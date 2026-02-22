import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import z from "zod";

import { protectedProcedure } from "../trpc";

export const importStudentRouter = {
  registrationNumber: protectedProcedure
    .input(
      z.object({
        by: z.enum(["id", "old_registration", "full_name", "others"]),
        ids: z.array(z.string()).optional(),
        old_registrations: z.array(z.string()).optional(),
        full_names: z.array(z.string()).optional(),
        new_registrations: z.array(z.string()),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (input.by === "id") {
        if (!input.ids || input.ids.length === 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "IDs are required when 'by' is 'id'",
          });
        } else {
          await Promise.all(
            input.ids.map((id, index) =>
              ctx.db.student.update({
                where: { id },
                data: { registrationNumber: input.new_registrations[index] },
              }),
            ),
          );
        }
      } else if (input.by === "old_registration") {
        if (!input.old_registrations || input.old_registrations.length === 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "Old registrations are required when 'by' is 'old_registration'",
          });
        } else {
          await Promise.all(
            input.old_registrations.map((old_registration, index) =>
              ctx.db.student.updateMany({
                where: { registrationNumber: old_registration },
                data: { registrationNumber: input.new_registrations[index] },
              }),
            ),
          );
        }
      } else if (input.by === "full_name") {
        // remove all space and make all lowercase, then select the student with firstnma+lastname matching,
        // then use the list to update by id
        if (!input.full_names || input.full_names.length === 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Full names are required when 'by' is 'full_name'",
          });
        } else {
          const students = await Promise.all(
            input.full_names.map((full_name) => {
              const q = full_name.replace(/\s+/g, "").toLowerCase().trim();
              const qq = `%${q}%`;
              return ctx.db.student.findFirst({
                where: {
                  AND: [
                    {
                      firstName: {
                        startsWith: qq,
                        mode: "insensitive",
                      },
                      lastName: {
                        endsWith: qq,
                        mode: "insensitive",
                      },
                    },
                  ],
                },
              });
            }),
          );
          const validStudents = students.filter((student) => student !== null);
          if (validStudents.length !== input.full_names.length) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message:
                "Some full names did not match any student. Please check your input.",
            });
          }
          await Promise.all(
            validStudents.map((student, index) =>
              ctx.db.student.update({
                where: { id: student.id },
                data: { registrationNumber: input.new_registrations[index] },
              }),
            ),
          );
        }
      } else {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Import method not supported yet",
        });
      }
      return { success: true };
    }),

  checkMapping: protectedProcedure
    .input(
      z.object({
        by: z.enum(["id", "old_registration", "full_name"]),
        match_values: z.array(z.string()),
        new_registrations: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const normalize = (s: string) =>
        s.toLowerCase().replace(/\s+/g, " ").trim();

      // Build student lookup map: key -> { id, registrationNumber }
      // We include registrationNumber so we can detect if the student already
      // has the new registration (no-op rows).
      const studentMap = new Map<
        string,
        { id: string; registrationNumber: string | null }
      >();

      if (input.by === "id") {
        const students = await ctx.db.student.findMany({
          where: { id: { in: input.match_values } },
          select: { id: true, registrationNumber: true },
        });
        students.forEach((s) => studentMap.set(s.id, s));
      } else if (input.by === "old_registration") {
        const students = await ctx.db.student.findMany({
          where: { registrationNumber: { in: input.match_values } },
          select: { id: true, registrationNumber: true },
        });
        students.forEach((s) => {
          if (s.registrationNumber) studentMap.set(s.registrationNumber, s);
        });
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      } else if (input.by === "full_name") {
        const students = await ctx.db.student.findMany({
          where: {
            enrollments: {
              some: { schoolYear: { id: ctx.schoolYearId } },
            },
          },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            registrationNumber: true,
          },
        });
        students.forEach((s) => {
          const key1 = normalize(s.firstName + " " + s.lastName);
          const key2 = normalize(s.lastName + " " + s.firstName);
          studentMap.set(key1, s);
          studentMap.set(key2, s);
        });
      }

      const results = input.match_values.map((value, index) => {
        const newReg = input.new_registrations[index] ?? "";
        const lookupKey = input.by === "full_name" ? normalize(value) : value;
        const student = studentMap.get(lookupKey);

        if (!student) {
          return { index, status: "unmatched" as const, studentId: undefined };
        }

        // The matched student already has the new registration — nothing to do.
        if (student.registrationNumber === newReg) {
          return {
            index,
            status: "already_exists" as const,
            studentId: student.id,
          };
        }

        return { index, status: "matched" as const, studentId: student.id };
      });

      return {
        results,
        matchedCount: results.filter((r) => r.status === "matched").length,
        unmatchedCount: results.filter((r) => r.status === "unmatched").length,
        alreadyExistsCount: results.filter((r) => r.status === "already_exists")
          .length,
      };
    }),

  checkFullNameMapping: protectedProcedure
    .input(
      z.object({
        full_names: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const normalize = (s: string) =>
        s.toLowerCase().replace(/\s+/g, "").trim();
      const targets = input.full_names.map(normalize);

      const students = await ctx.db.student.findMany({
        where: {
          enrollments: {
            some: {
              schoolYear: {
                id: ctx.schoolYearId,
              },
            },
          },
        },
      });
      const validStudents = students
        .filter((s) =>
          targets.includes(normalize(s.firstName + " " + s.lastName)),
        )
        .map((s) => normalize(s.firstName + " " + s.lastName));

      const matched = targets.map((name, index) => ({
        index,
        isValid: validStudents.includes(normalize(name)),
      }));

      return {
        allMatched: matched.every((m) => m.isValid),
        matched,
        unmatched: matched.filter((m) => !m.isValid),
      };
    }),
} satisfies TRPCRouterRecord;
