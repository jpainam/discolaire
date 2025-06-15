import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { subMonths } from "date-fns";
import { fromZonedTime } from "date-fns-tz";
import { z } from "zod";

import type { Prisma } from "@repo/db";
import redisClient from "@repo/kv";

import { accountService } from "../services/account-service";
import { contactService } from "../services/contact-service";
import { isRepeating, studentService } from "../services/student-service";
import { createUser } from "../services/user-service";
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
            { email: { startsWith: qq, mode: "insensitive" } },
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
  email: z.string().email().optional().or(z.literal("")),
  residence: z.string().optional(),
  sunPlusNo: z.string().optional(),
  phoneNumber: z.string().optional(),
  formerSchoolId: z.string().min(1),
  isRepeating: z.boolean().optional().default(false),
  isNew: z.boolean().optional().default(true),
  countryId: z.string().min(1),
  isBaptized: z.boolean().optional().default(false),
  religionId: z.string().optional(),
  dateOfEntry: z.coerce.date().optional(),
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
      if (ctx.session.user.profile === "student") {
        const student = await studentService.getFromUserId(ctx.session.user.id);
        const stud = await studentService.get(
          student.id,
          ctx.schoolYearId,
          ctx.schoolId,
        );
        return [stud];
      }
      const studentIds: string[] = [];
      if (ctx.session.user.profile === "contact") {
        const contact = await contactService.getFromUserId(ctx.session.user.id);
        const studentContacts = await contactService.getStudents(contact.id);
        studentIds.push(...studentContacts.map((sc) => sc.studentId));
      }
      const data = await ctx.db.student.findMany({
        take: input?.limit ?? 50,
        orderBy: {
          lastAccessed: "desc",
        },
        where: {
          schoolId: ctx.schoolId,
          ...(studentIds.length > 0 ? { id: { in: studentIds } } : {}),
        },
        include: {
          formerSchool: true,
          religion: true,
          user: true,
          country: true,
          enrollments: {
            include: {
              classroom: true,
            },
          },
        },
      });

      const students = data.map((student) => {
        const currentEnrollment = student.enrollments.find(
          (enr) => enr.classroom.schoolYearId === ctx.schoolYearId,
        );

        const previousSameLevel = student.enrollments.some(
          (enr) =>
            enr.classroom.schoolYearId !== ctx.schoolYearId &&
            enr.classroom.levelId === currentEnrollment?.classroom.levelId,
        );

        return {
          ...student,
          isRepeating: previousSameLevel,
          classroom: currentEnrollment?.classroom,
        };
      });
      return students;
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
      const data = await ctx.db.student.findMany({
        take: input.limit,
        orderBy: {
          lastName: "asc",
        },
        where: {
          schoolId: ctx.schoolId,
          enrollments: {
            some: {
              schoolYearId: ctx.schoolYearId,
              classroom: {
                ...(input.classroomId ? { id: input.classroomId } : {}),
              },
            },
          },
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
            classroom: await studentService.getClassroom(
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
          email: input.email,
          sunPlusNo: input.sunPlusNo,
          residence: input.residence,
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
          createdById: ctx.session.user.id,
          schoolId: ctx.schoolId,
        },
      });
      await ctx.db.logActivity.create({
        data: {
          schoolId: ctx.schoolId,
          schoolYearId: ctx.schoolYearId,
          userId: ctx.session.user.id,
          title: "Student profile",
          type: "CREATE",
          url: `/students/${student.id}`,
          entityId: student.id,
          entityType: "student",
        },
      });
      await createUser({
        email: input.email,
        username:
          `${input.firstName.toLowerCase()}-${input.lastName.toLowerCase()}`.replace(
            /[^a-zA-Z0-9]/g,
            "",
          ),
        authApi: ctx.authApi,
        profile: "student",
        schoolId: ctx.schoolId,
        name: `${input.firstName} ${input.lastName}`,
        isActive: true,
        entityId: student.id,
      });

      void studentService.addClubs(student.id, input.clubs ?? []);
      void studentService.addSports(student.id, input.sports ?? []);

      void accountService.attachAccount(
        student.id,
        `${student.firstName} ${student.lastName}`,
        ctx.session.user.id,
      );
      if (input.classroom) {
        await ctx.db.enrollment.create({
          data: {
            studentId: student.id,
            classroomId: input.classroom,
            schoolYearId: ctx.schoolYearId,
            createdBy: ctx.session.user.id,
          },
        });
        await ctx.db.logActivity.create({
          data: {
            schoolId: ctx.schoolId,
            schoolYearId: ctx.schoolYearId,
            userId: ctx.session.user.id,
            title: "Student enrollment",
            type: "CREATE",
            url: `/students/${student.id}/enrollments`,
            entityId: student.id,
            entityType: "student",
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
      void accountService.attachAccount(
        input.id,
        `${input.firstName} ${input.lastName}`,
        ctx.session.user.id,
      );
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
      await ctx.db.logActivity.create({
        data: {
          schoolId: ctx.schoolId,
          schoolYearId: ctx.schoolYearId,
          userId: ctx.session.user.id,
          title: "Student profile",
          type: "UPDATE",
          url: `/students/${input.id}`,
          entityId: input.id,
          data: input,
          entityType: "student",
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
          email: input.email,
          isRepeating: input.isRepeating,
          isNew: input.isNew,
          sunPlusNo: input.sunPlusNo,
          residence: input.residence,
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
  contacts: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const contacts = await ctx.db.studentContact.findMany({
        where: {
          studentId: input,
        },
        include: {
          contact: {
            include: {
              user: {
                include: {
                  roles: true,
                },
              },
            },
          },
          relationship: true,
        },
      });
      void Promise.all(
        contacts.map((stdc) =>
          redisClient.sadd(`contact:${stdc.contact.id}:students`, input),
        ),
      );

      return contacts;
    }),
  delete: protectedProcedure
    .input(z.union([z.string(), z.array(z.string())]))
    .mutation(({ ctx, input }) => {
      return studentService.delete(input, ctx.schoolId);
    }),
  siblings: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db.student.findMany({
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
        return studentService.getClassroom(input.studentId, input.schoolYearId);
      }
      return studentService.getClassroom(input.studentId, ctx.schoolYearId);
    }),

  get: protectedProcedure
    .input(z.string().min(1))
    .query(async ({ ctx, input }) => {
      return studentService.get(input, ctx.schoolYearId, ctx.schoolId);
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
    .input(z.object({ id: z.string(), termId: z.coerce.number().optional() }))
    .query(({ ctx, input }) => {
      return studentService.getGrades({
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
                { email: { startsWith: qq, mode: "insensitive" } },
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
      where: {
        account: {
          studentId: input,
        },
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
      const classroom = await studentService.getClassroom(
        input,
        ctx.schoolYearId,
      );
      if (!classroom) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Classroom not found",
        });
      }
      return studentService.getUnpaidRequiredFees(input, classroom.id);
    }),

  disable: protectedProcedure
    .input(z.object({ id: z.string().min(1), isActive: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
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
} satisfies TRPCRouterRecord;
