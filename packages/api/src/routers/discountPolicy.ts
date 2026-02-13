import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";

import type { Prisma } from "@repo/db";
import { DiscountAssignmentStatus } from "@repo/db/enums";

import { protectedProcedure } from "../trpc";

const criterionTypeSchema = z.enum([
  "ALWAYS",
  "SIBLING_COUNT",
  "STAFF_CHILD",
  "RELIGION",
]);
const valueTypeSchema = z.enum(["PERCENT", "FIXED"]);

const createPolicySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  criterionType: criterionTypeSchema,
  criterionConfig: z.unknown().optional(),
  valueType: valueTypeSchema.default("PERCENT"),
  value: z.number().nonnegative(),
  maxAmount: z.number().nonnegative().nullish(),
  stackable: z.boolean().default(true),
  priority: z.number().int().default(100),
  isActive: z.boolean().default(true),
  activeFrom: z.coerce.date().nullish(),
  activeTo: z.coerce.date().nullish(),
  schoolYearId: z.string().nullish(),
  classroomId: z.string().nullish(),
});

export const discountPolicyRouter = {
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.discountPolicy.findMany({
      where: {
        schoolId: ctx.schoolId,
      },
      include: {
        schoolYear: true,
        classroom: true,
        _count: {
          select: {
            assignments: true,
          },
        },
      },
      orderBy: [{ priority: "asc" }, { createdAt: "desc" }],
    });
  }),

  create: protectedProcedure
    .input(createPolicySchema)
    .mutation(({ ctx, input }) => {
      const { criterionConfig: _criterionConfig, ...rest } = input;
      const criterionConfig =
        _criterionConfig === undefined
          ? undefined
          : (_criterionConfig as Prisma.InputJsonValue);
      return ctx.db.discountPolicy.create({
        data: {
          ...rest,
          criterionConfig,
          schoolId: ctx.schoolId,
          schoolYearId: rest.schoolYearId ?? null,
          classroomId: rest.classroomId ?? null,
          activeFrom: rest.activeFrom ?? null,
          activeTo: rest.activeTo ?? null,
          maxAmount: rest.maxAmount ?? null,
        },
      });
    }),

  update: protectedProcedure
    .input(createPolicySchema.extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const policy = await ctx.db.discountPolicy.findUnique({
        where: { id: input.id },
        select: { schoolId: true },
      });
      if (!policy || policy.schoolId !== ctx.schoolId) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Policy not found" });
      }
      const { id, criterionConfig: _criterionConfig, ...rest } = input;
      const criterionConfig =
        _criterionConfig === undefined
          ? undefined
          : (_criterionConfig as Prisma.InputJsonValue);
      return ctx.db.discountPolicy.update({
        where: { id },
        data: {
          ...rest,
          criterionConfig,
          schoolYearId: rest.schoolYearId ?? null,
          classroomId: rest.classroomId ?? null,
          activeFrom: rest.activeFrom ?? null,
          activeTo: rest.activeTo ?? null,
          maxAmount: rest.maxAmount ?? null,
        },
      });
    }),

  delete: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const policy = await ctx.db.discountPolicy.findUnique({
      where: { id: input },
      select: { schoolId: true },
    });
    if (!policy || policy.schoolId !== ctx.schoolId) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Policy not found" });
    }
    return ctx.db.discountPolicy.delete({
      where: { id: input },
    });
  }),

  assignments: protectedProcedure
    .input(z.object({ policyId: z.string() }))
    .query(async ({ ctx, input }) => {
      const policy = await ctx.db.discountPolicy.findUnique({
        where: { id: input.policyId },
        select: { schoolId: true },
      });
      if (!policy || policy.schoolId !== ctx.schoolId) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Policy not found" });
      }
      return ctx.db.discountPolicyAssignment.findMany({
        where: {
          policyId: input.policyId,
        },
        include: {
          student: true,
        },
        orderBy: [{ status: "asc" }, { source: "asc" }, { createdAt: "desc" }],
      });
    }),

  studentAssignments: protectedProcedure
    .input(z.object({ studentId: z.string() }))
    .query(async ({ ctx, input }) => {
      const student = await ctx.db.student.findUnique({
        where: { id: input.studentId },
        select: { schoolId: true },
      });
      if (!student || student.schoolId !== ctx.schoolId) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Student not found" });
      }
      return ctx.db.discountPolicyAssignment.findMany({
        where: {
          studentId: input.studentId,
          policy: { schoolId: ctx.schoolId },
        },
        include: {
          policy: true,
        },
        orderBy: [{ status: "asc" }, { source: "asc" }, { createdAt: "desc" }],
      });
    }),

  setStudentDecision: protectedProcedure
    .input(
      z.object({
        policyId: z.string(),
        studentId: z.string(),
        status: z.enum(["ALLOW", "DENY"]),
        note: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [policy, student] = await Promise.all([
        ctx.db.discountPolicy.findUnique({
          where: { id: input.policyId },
          select: { schoolId: true },
        }),
        ctx.db.student.findUnique({
          where: { id: input.studentId },
          select: { schoolId: true },
        }),
      ]);
      if (!policy || policy.schoolId !== ctx.schoolId) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Policy not found" });
      }
      if (!student || student.schoolId !== ctx.schoolId) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Student not found" });
      }
      return ctx.services.billing.setManualAssignment({
        policyId: input.policyId,
        studentId: input.studentId,
        status:
          input.status === "DENY"
            ? DiscountAssignmentStatus.DENY
            : DiscountAssignmentStatus.ALLOW,
        note: input.note,
      });
    }),

  clearStudentDecision: protectedProcedure
    .input(
      z.object({
        policyId: z.string(),
        studentId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.services.billing.clearManualAssignment({
        policyId: input.policyId,
        studentId: input.studentId,
      });
    }),

  syncStudent: protectedProcedure
    .input(
      z.object({
        studentId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const student = await ctx.db.student.findUnique({
        where: { id: input.studentId },
        select: { schoolId: true },
      });
      if (!student || student.schoolId !== ctx.schoolId) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Student not found" });
      }
      await ctx.services.billing.syncAutoDiscountAssignmentsForStudent({
        studentId: input.studentId,
        schoolId: ctx.schoolId,
        schoolYearId: ctx.schoolYearId,
        trigger: "STUDENT_UPDATED",
      });
      return { ok: true };
    }),
} satisfies TRPCRouterRecord;
