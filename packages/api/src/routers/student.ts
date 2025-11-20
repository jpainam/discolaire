import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { subMonths } from "date-fns";
import { fromZonedTime } from "date-fns-tz";
import { z } from "zod/v4";

import type { Prisma } from "@repo/db";

import { checkPermission } from "../permission";
import { getUnpaidFeeDescription } from "../services/accounting-service";
import { contactService } from "../services/contact-service";
import { getEnrollStudents } from "../services/enrollment-service";
import { staffService } from "../services/staff-service";
import { isRepeating, studentService } from "../services/student-service";
import { protectedProcedure } from "../trpc";

const whereClause = (q: string): Prisma.StudentFindManyArgs => {
  const qq = `%${q}%`;
  return {
    where: {
      AND: [
        {
          OR: [
            { id: { startsWith: qq, mode: "insensitive" } },
            { firstName: { startsWith: qq, mode: "insensitive" } },
            { lastName: { startsWith: qq, mode: "insensitive" } },
            { residence: { startsWith: qq, mode: "insensitive" } },
            { phoneNumber: { startsWith: qq, mode: "insensitive" } },
            {
              user: { email: { startsWith: qq, mode: "insensitive" } },
            },
            { registrationNumber: { startsWith: qq, mode: "insensitive" } },
          ],
        },
      ],
    },
  };
};
const createUpdateSchema = z.object({
  registrationNumber: z.string().optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  dateOfBirth: z.coerce.date(),
  placeOfBirth: z.string().min(1),
  gender: z.string().min(1),
  residence: z.string().optional(),
  externalAccountingNo: z.string().optional(),
  phoneNumber: z.string().optional(),
  formerSchoolId: z.string().min(1),
  allergies: z.string().optional(),
  isRepeating: z.boolean().optional().default(false),
  isNew: z.boolean().optional().default(true),
  countryId: z.string().min(1),
  isBaptized: z.boolean().optional().default(false),
  religionId: z.string().optional(),
  dateOfEntry: z.coerce.date().optional(),
  bloodType: z.string().optional().default(""),
  dateOfExit: z.coerce.date().optional(),
  tags: z.array(z.string()).optional(),
  observation: z.string().optional(),
  socialMedias: z.array(z.string()).optional().default([]),
  clubs: z.array(z.string()).optional(),
  sports: z.array(z.string()).optional(),
  hobbies: z.array(z.string()).optional().default([]),
  status: z
    .enum(["ACTIVE", "GRADUATED", "INACTIVE", "EXPELLED"])
    .default("ACTIVE"),
  classroom: z.string().optional(),
});
export const studentRouter = {
  all: protectedProcedure
    .input(
      z
        .object({
          limit: z.number().optional().default(10),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const studentIds: string[] = [];
      if (ctx.session.user.profile === "student") {
        const student = await ctx.services.student.getFromUserId(
          ctx.session.user.id,
        );
        studentIds.push(student.id);
      } else if (ctx.session.user.profile === "contact") {
        const contact = await contactService.getFromUserId(ctx.session.user.id);
        const studentContacts = await contactService.getStudents(contact.id);
        studentIds.push(...studentContacts.map((sc) => sc.studentId));
      }
      return getEnrollStudents({
        schoolYearId: ctx.schoolYearId,
        limit: input?.limit,
        studentIds,
      });
    }),
  search: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional().default(30),
        query: z.string().optional().default(""),
        classroomId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (ctx.session.user.profile != "staff") {
        return [];
      }
      const canReadStudent = checkPermission(
        "student",
        "Read",
        {},
        ctx.permissions,
      );
      const studentIds: string[] = [];
      if (!canReadStudent) {
        const staff = await staffService.getFromUserId(ctx.session.user.id);
        const students = await staffService.getStudents(
          staff.id,
          ctx.schoolYearId,
        );
        studentIds.push(...students.map((s) => s.id));
      }

      const data = await ctx.db.student.findMany({
        take: input.limit,
        orderBy: {
          lastName: "asc",
        },
        where: {
          schoolId: ctx.schoolId,
          enrollments: {
            some: {
              //schoolYearId: ctx.schoolYearId,
              classroom: {
                ...(input.classroomId ? { id: input.classroomId } : {}),
              },
            },
          },
          ...(studentIds.length > 0 ? { id: { in: studentIds } } : {}),
          ...whereClause(input.query).where,
        },
        include: {
          formerSchool: true,
          user: true,
          enrollments: {
            include: {
              classroom: true,
              schoolYear: true,
            },
          },
          religion: true,
          country: true,
        },
      });

      const students = await Promise.all(
        data.map(async (student) => {
          return {
            ...student,
            isRepeating: await isRepeating(student.id, ctx.schoolYearId),
            classroom: await ctx.services.student.getClassroom(
              student.id,
              ctx.schoolYearId,
            ),
          };
        }),
      );
      return students;
    }),

  create: protectedProcedure
    .input(createUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const registrationNumber =
        input.registrationNumber ??
        (await studentService.generateRegistrationNumber({
          schoolId: ctx.schoolId,
          schoolYearId: ctx.schoolYearId,
        }));
      if (await studentService.registrationNumberExists(registrationNumber)) {
        console.warn("Registration number already exists", registrationNumber);
        // throw new TRPCError({
        //   code: "BAD_REQUEST",
        //   message: "Registration number already exists",
        // });
      }

      const student = await ctx.db.student.create({
        data: {
          registrationNumber: registrationNumber,
          firstName: input.firstName,
          lastName: input.lastName,
          //userId: user.id,
          dateOfBirth: fromZonedTime(input.dateOfBirth, "UTC"),
          placeOfBirth: input.placeOfBirth,
          gender: input.gender,
          externalAccountingNo: input.externalAccountingNo,
          residence: input.residence,
          allergies: input.allergies,
          isNew: input.isNew,
          isRepeating: input.isRepeating,
          phoneNumber: input.phoneNumber,
          formerSchoolId: input.formerSchoolId,
          countryId: input.countryId,
          isBaptized: input.isBaptized,
          religionId: input.religionId,
          dateOfEntry: input.dateOfEntry
            ? fromZonedTime(input.dateOfEntry, "UTC")
            : undefined,
          dateOfExit: input.dateOfExit
            ? fromZonedTime(input.dateOfExit, "UTC")
            : undefined,
          tags: input.tags,
          observation: input.observation,
          status: input.status,
          hobbies: input.hobbies,
          bloodType: input.bloodType,
          createdById: ctx.session.user.id,
          schoolId: ctx.schoolId,
        },
      });
      await ctx.pubsub.publish("student", {
        type: "create",
        data: {
          id: student.id,
          metadata: {
            name: student.lastName,
          },
        },
      });
      void studentService.addClubs(student.id, input.clubs ?? []);
      void studentService.addSports(student.id, input.sports ?? []);

      if (input.classroom) {
        const enr = await ctx.db.enrollment.create({
          data: {
            studentId: student.id,
            classroomId: input.classroom,
            schoolYearId: ctx.schoolYearId,
            createdById: ctx.session.user.id,
          },
        });
        await ctx.pubsub.publish("enrollment", {
          type: "create",
          data: {
            id: enr.id.toString(),
            metadata: {
              name: student.lastName,
            },
          },
        });
      }
      return student;
    }),
  update: protectedProcedure
    .input(createUpdateSchema.extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      void studentService.addClubs(input.id, input.clubs ?? []);
      void studentService.addSports(input.id, input.sports ?? []);

      if (
        input.registrationNumber &&
        (await studentService.registrationNumberExists(
          input.registrationNumber,
          input.id,
        ))
      ) {
        // throw new TRPCError({
        //   code: "BAD_REQUEST",
        //   message: "Registration number already exists",
        // });
      }
      await ctx.pubsub.publish("student", {
        type: "update",
        data: {
          id: input.id,
          metadata: {
            name: input.lastName,
          },
        },
      });
      return ctx.db.student.update({
        where: { id: input.id },
        data: {
          registrationNumber: input.registrationNumber,
          firstName: input.firstName,
          lastName: input.lastName,
          dateOfBirth: fromZonedTime(input.dateOfBirth, "UTC"),
          placeOfBirth: input.placeOfBirth,
          gender: input.gender,
          allergies: input.allergies,
          isRepeating: input.isRepeating,
          isNew: input.isNew,
          externalAccountingNo: input.externalAccountingNo,
          residence: input.residence,
          phoneNumber: input.phoneNumber,
          formerSchoolId: input.formerSchoolId,
          countryId: input.countryId,
          isBaptized: input.isBaptized,
          religionId: input.religionId,
          bloodType: input.bloodType,
          dateOfEntry: input.dateOfEntry
            ? fromZonedTime(input.dateOfEntry, "UTC")
            : undefined,
          dateOfExit: input.dateOfExit
            ? fromZonedTime(input.dateOfExit, "UTC")
            : undefined,
          tags: input.tags,
          observation: input.observation,
          status: input.status,
          hobbies: input.hobbies,
          createdById: ctx.session.user.id,
        },
      });
    }),
  count: protectedProcedure
    .input(
      z
        .object({
          q: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const students = await ctx.db.student.findMany({
        where: { schoolId: ctx.schoolId, ...whereClause(input?.q ?? "").where },
      });
      const female = students.filter((std) => std.gender == "female").length;
      const male = students.length - female;
      const newStudents = await ctx.db.student.count({
        where: {
          schoolId: ctx.schoolId,

          createdAt: { gte: subMonths(new Date(), 1) },
        },
      });
      return { total: students.length, new: newStudents, female, male };
    }),
  contacts: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.studentContact.findMany({
      where: {
        studentId: input,
      },
      include: {
        contact: {
          include: {
            user: true,
          },
        },
        relationship: true,
      },
    });
  }),
  delete: protectedProcedure
    .input(z.union([z.string(), z.array(z.string())]))
    .mutation(async ({ ctx, input }) => {
      const r = await studentService.delete(input, ctx.schoolId);
      await ctx.pubsub.publish("student", {
        type: "delete",
        data: {
          id: Array.isArray(input) ? input.join(",") : input,
        },
      });
      return r;
    }),
  siblings: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db.student.findMany({
        include: {
          user: true,
        },
        where: {
          siblings: {
            some: {
              studentId: input,
            },
          },
        },
      });
    }),

  classroom: protectedProcedure
    .input(
      z.object({ studentId: z.string(), schoolYearId: z.string().optional() }),
    )
    .query(({ ctx, input }) => {
      // return the current classroom
      if (input.schoolYearId) {
        return ctx.services.student.getClassroom(
          input.studentId,
          input.schoolYearId,
        );
      }
      return ctx.services.student.getClassroom(
        input.studentId,
        ctx.schoolYearId,
      );
    }),

  get: protectedProcedure.input(z.string().min(1)).query(({ ctx, input }) => {
    return ctx.services.student.get(input, ctx.schoolYearId, ctx.schoolId);
  }),
  selector: protectedProcedure.query(({ ctx }) => {
    return ctx.db.student.findMany({
      where: {
        schoolId: ctx.schoolId,
      },
      orderBy: {
        lastName: "asc",
      },
    });
  }),

  enrollments: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.enrollment.findMany({
      where: {
        studentId: input,
      },
      include: {
        student: true,
        classroom: true,
        schoolYear: true,
      },
      orderBy: {
        schoolYearId: "desc",
      },
    });
  }),
  grades: protectedProcedure
    .input(z.object({ id: z.string(), termId: z.string().optional() }))
    .query(({ ctx, input }) => {
      return ctx.services.student.getGrades({
        studentId: input.id,
        termId: input.termId,
        schoolYearId: ctx.schoolYearId,
      });
    }),
  unlinkedContacts: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional().default(10),
        page: z.number().optional().default(1),
        q: z.string().optional(),
        studentId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const qq = `%${input.q}%`;
      return ctx.db.contact.findMany({
        take: input.limit,
        include: {
          user: true,
        },
        orderBy: {
          lastName: "asc",
        },
        where: {
          AND: [
            {
              schoolId: ctx.schoolId,
            },
            {
              OR: [
                { firstName: { startsWith: qq, mode: "insensitive" } },
                { lastName: { startsWith: qq, mode: "insensitive" } },
                { phoneNumber1: { startsWith: qq, mode: "insensitive" } },
                { phoneNumber2: { startsWith: qq, mode: "insensitive" } },
                { user: { email: { startsWith: qq, mode: "insensitive" } } },
              ],
            },
            {
              studentContacts: {
                none: {
                  studentId: input.studentId,
                },
              },
            },
          ],
        },
      });
    }),

  transactions: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.transaction.findMany({
      include: {
        journal: true,
        createdBy: true,
        receivedBy: true,
        deletedBy: true,
      },
      where: {
        studentId: input,
        deletedAt: null,
        schoolYearId: ctx.schoolYearId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
  unpaidRequiredFees: protectedProcedure
    .input(z.string().min(1))
    .query(async ({ ctx, input }) => {
      const classroom = await ctx.services.student.getClassroom(
        input,
        ctx.schoolYearId,
      );
      if (!classroom) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Classroom not found",
        });
      }
      return getUnpaidFeeDescription(input, classroom.id);
    }),

  disable: protectedProcedure
    .input(z.object({ id: z.string().min(1), isActive: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.pubsub.publish("student", {
        type: "update",
        data: {
          id: input.id,
          metadata: {
            name: input.isActive ? "Enabled" : "Disabled",
          },
        },
      });
      return ctx.db.student.update({
        where: {
          id: input.id,
        },
        data: {
          isActive: input.isActive,
        },
      });
    }),

  addPhoto: protectedProcedure
    .input(
      z.object({
        url: z.string().min(1),
        id: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const student = await ctx.db.student.findFirstOrThrow({
        where: {
          id: input.id,
        },
      });
      const photos = [...student.photos, input.url];
      await ctx.pubsub.publish("student", {
        type: "update",
        data: {
          id: input.id,
          metadata: {
            name: "Added photo",
          },
        },
      });
      return ctx.db.student.update({
        where: {
          id: input.id,
        },
        data: {
          photos: photos,
        },
      });
    }),

  getPrimaryContact: protectedProcedure
    .input(z.string().min(1))
    .query(async ({ ctx, input }) => {
      const contacts = await ctx.db.studentContact.findMany({
        include: {
          contact: {
            include: {
              user: true,
            },
          },
          relationship: true,
        },
        where: {
          studentId: input,
        },
      });

      const contact = contacts.filter((c) => c.primaryContact);
      if (contact.length > 0) {
        return contact[0];
      }
      return contacts.length > 0 ? contacts[0] : null;
    }),
  getPrimaryContacts: protectedProcedure
    .input(
      z.object({
        classroomId: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const contacts = await ctx.db.studentContact.findMany({
        include: {
          contact: {
            include: {
              user: true,
            },
          },
          relationship: true,
        },
        where: {
          student: {
            enrollments: {
              some: {
                classroomId: input.classroomId,
              },
            },
          },
        },
      });
      return contacts.filter((c) => c.primaryContact);
    }),
  updateStatus: protectedProcedure
    .input(
      z.object({
        studentId: z.string().min(1),
        status: z.enum(["ACTIVE", "GRADUATED", "INACTIVE", "EXPELLED"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.pubsub.publish("student", {
        type: "update_status",
        data: {
          id: input.studentId,
          metadata: {
            name: input.status,
          },
        },
      });
      return ctx.db.student.update({
        where: {
          id: input.studentId,
        },
        data: {
          status: input.status,
        },
      });
    }),

  getFromUserId: protectedProcedure
    .input(z.string().min(1))
    .query(async ({ ctx, input }) => {
      return ctx.db.student.findFirstOrThrow({
        where: {
          userId: input,
        },
      });
    }),

  gradeTrends: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const grades = await ctx.db.grade.findMany({
        where: {
          studentId: input,
          gradeSheet: {
            subject: {
              classroom: {
                schoolYearId: ctx.schoolYearId,
                schoolId: ctx.schoolId,
              },
            },
          },
        },
        include: {
          gradeSheet: {
            include: {
              subject: {
                include: {
                  course: true,
                },
              },
            },
          },
        },
        orderBy: {
          gradeSheet: {
            createdAt: "desc",
          },
        },
      });
      const gradeSheetIds = grades.map((g) => g.gradeSheetId);

      const maxGrades = await ctx.db.grade.groupBy({
        by: ["gradeSheetId"],
        where: {
          gradeSheetId: { in: gradeSheetIds },
        },
        _max: {
          grade: true,
        },
      });
      const maxGradeMap = new Map<number, number>();
      maxGrades.forEach((entry) => {
        maxGradeMap.set(entry.gradeSheetId, entry._max.grade ?? 0);
      });
      return grades.map((grade) => ({
        subjectId: grade.gradeSheet.subjectId,
        date: grade.gradeSheet.createdAt,
        name: grade.gradeSheet.subject.course.reportName,
        grade: grade.grade,
        maxGrade: maxGradeMap.get(grade.gradeSheetId),
      }));
    }),

  documents: protectedProcedure
    .input(z.string().min(1))
    .query(async ({ ctx, input }) => {
      const student = await ctx.db.student.findUniqueOrThrow({
        where: {
          id: input,
        },
      });
      if (!student.userId) {
        return [];
      }
      return ctx.db.document.findMany({
        orderBy: {
          createdAt: "desc",
        },
        include: {
          createdBy: true,
        },
        where: {
          userId: student.userId,
        },
      });
    }),
  excluded: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.student.findMany({
      include: {
        user: true,
        formerSchool: true,
      },
      where: {
        status: "EXPELLED",
      },
    });
  }),
} satisfies TRPCRouterRecord;
