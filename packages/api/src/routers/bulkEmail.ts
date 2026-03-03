import type { TRPCRouterRecord } from "@trpc/server";
import { nanoid } from "nanoid";
import { z } from "zod/v4";

import type { Prisma, PrismaClient } from "@repo/db";
import { broadcastEmail } from "@repo/messaging/client";

import { ActivityAction, ActivityTargetType } from "../activity-logger";
import { protectedProcedure } from "../trpc";

// ─── Zod schemas ─────────────────────────────────────────────────────────────

const RecipientTargetSchema = z.object({
  mode: z.enum(["broadcast", "class-based"]),
  classIds: z.array(z.string()),
  broadcastRoles: z.array(
    z.enum(["parents", "teachers", "students", "staff", "all"]),
  ),
  classRecipientMode: z.enum([
    "all",
    "parents",
    "teachers",
    "students",
    "specific-teacher",
  ]),
  specificPersonIds: z.array(z.string()),
});

type RecipientTarget = z.infer<typeof RecipientTargetSchema>;

// ─── Recipient resolution ────────────────────────────────────────────────────

interface ResolvedRecipient {
  email: string;
  name: string | null;
  recipientType: "contact" | "staff" | "student";
  recipientId: string;
}

async function resolveRecipients(
  db: PrismaClient,
  schoolId: string,
  schoolYearId: string,
  target: RecipientTarget,
): Promise<ResolvedRecipient[]> {
  const results: ResolvedRecipient[] = [];
  const seen = new Set<string>(); // deduplicate by email

  function add(r: ResolvedRecipient) {
    if (r.email && !seen.has(r.email)) {
      seen.add(r.email);
      results.push(r);
    }
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  // Valid email: must contain "@" and not be a placeholder/example address
  const validEmail: Prisma.StringNullableFilter = { contains: "@" };
  const notExampleDomain = { email: { endsWith: "example.com" } };

  async function fetchParents(classroomIds?: string[]) {
    const studentWhere: Prisma.StudentWhereInput = {
      isActive: true,
      enrollments: classroomIds
        ? { some: { classroomId: { in: classroomIds } } }
        : { some: { schoolYearId } },
    };

    const contacts = await db.contact.findMany({
      where: {
        schoolId,
        isActive: true,
        email: validEmail,
        NOT: notExampleDomain,
        studentContacts: { some: { student: studentWhere } },
      },
      select: { id: true, firstName: true, lastName: true, email: true },
    });

    for (const c of contacts) {
      if (!c.email) continue;
      add({
        email: c.email,
        name: [c.firstName, c.lastName].filter(Boolean).join(" ") || null,
        recipientType: "contact",
        recipientId: c.id,
      });
    }
  }

  async function fetchStaff(classroomIds?: string[], specificIds?: string[]) {
    const where: Prisma.StaffWhereInput = {
      schoolId,
      isActive: true,
      email: validEmail,
      NOT: notExampleDomain,
    };
    if (specificIds && specificIds.length > 0) {
      where.id = { in: specificIds };
    } else if (classroomIds) {
      where.subjects = { some: { classroomId: { in: classroomIds } } };
    }

    const staffList = await db.staff.findMany({
      where,
      select: { id: true, firstName: true, lastName: true, email: true },
    });

    for (const s of staffList) {
      if (!s.email) continue;
      add({
        email: s.email,
        name: [s.firstName, s.lastName].filter(Boolean).join(" ") || null,
        recipientType: "staff",
        recipientId: s.id,
      });
    }
  }

  async function fetchStudents(classroomIds?: string[]) {
    const students = await db.student.findMany({
      where: {
        schoolId,
        isActive: true,
        email: validEmail,
        NOT: notExampleDomain,
        enrollments: classroomIds
          ? { some: { classroomId: { in: classroomIds } } }
          : { some: { schoolYearId } },
      },
      select: { id: true, firstName: true, lastName: true, email: true },
    });

    for (const s of students) {
      if (!s.email) continue;
      add({
        email: s.email,
        name: [s.firstName, s.lastName].filter(Boolean).join(" ") || null,
        recipientType: "student",
        recipientId: s.id,
      });
    }
  }

  // ── Resolution ────────────────────────────────────────────────────────────

  if (target.mode === "broadcast") {
    const roles = target.broadcastRoles;
    const all = roles.includes("all");

    if (all || roles.includes("parents")) await fetchParents();
    if (all || roles.includes("staff") || roles.includes("teachers")) {
      await fetchStaff();
    }
    if (all || roles.includes("students")) await fetchStudents();
  } else {
    // class-based
    const classroomIds = target.classIds;

    switch (target.classRecipientMode) {
      case "parents":
        await fetchParents(classroomIds);
        break;
      case "teachers":
        await fetchStaff(classroomIds);
        break;
      case "students":
        await fetchStudents(classroomIds);
        break;
      case "specific-teacher":
        await fetchStaff(classroomIds, target.specificPersonIds);
        break;
      case "all":
        await fetchParents(classroomIds);
        await fetchStaff(classroomIds);
        await fetchStudents(classroomIds);
        break;
    }
  }

  return results;
}

// ─── Router ──────────────────────────────────────────────────────────────────

export const bulkEmailRouter = {
  /**
   * List classrooms for the recipient selector, including teacher / student /
   * parent counts so the UI can display them without extra round-trips.
   */
  listClassrooms: protectedProcedure.query(async ({ ctx }) => {
    const classrooms = await ctx.db.classroom.findMany({
      where: {
        schoolYearId: ctx.schoolYearId,
        schoolId: ctx.schoolId,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        level: { select: { name: true } },
        subjects: {
          where: { teacherId: { not: null } },
          select: {
            teacherId: true,
            teacher: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
          distinct: ["teacherId"],
        },
        enrollments: {
          where: { student: { isActive: true } },
          select: {
            student: {
              select: {
                id: true,
                studentContacts: {
                  where: { contact: { email: { not: null }, isActive: true } },
                  select: { contactId: true },
                },
              },
            },
          },
        },
      },
      orderBy: [{ level: { order: "asc" } }, { name: "asc" }],
    });

    return classrooms.map((c) => {
      // All assigned teachers (email may be empty; filtering for send is listStaff's job)
      const teacherMap = new Map<
        string,
        { id: string; name: string; email: string }
      >();
      for (const s of c.subjects) {
        if (s.teacher && !teacherMap.has(s.teacher.id)) {
          teacherMap.set(s.teacher.id, {
            id: s.teacher.id,
            name:
              [s.teacher.firstName, s.teacher.lastName]
                .filter(Boolean)
                .join(" ") || s.teacher.id,
            email: s.teacher.email ?? "",
          });
        }
      }

      const studentCount = c.enrollments.length;
      // Unique parent contacts across enrolled students
      const parentIds = new Set<string>();
      for (const e of c.enrollments) {
        for (const sc of e.student.studentContacts) {
          parentIds.add(sc.contactId);
        }
      }

      return {
        id: c.id,
        name: c.name,
        grade: c.level.name,
        teachers: Array.from(teacherMap.values()),
        studentCount,
        parentCount: parentIds.size,
      };
    });
  }),

  /**
   * List all active staff with emails for the broadcast selector.
   */
  listStaff: protectedProcedure.query(async ({ ctx }) => {
    const staffList = await ctx.db.staff.findMany({
      where: {
        schoolId: ctx.schoolId,
        isActive: true,
        email: { contains: "@" },
        NOT: { email: { endsWith: "example.com" } },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        isTeacher: true,
      },
      orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    });

    return staffList.map((s) => ({
      id: s.id,
      name:
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        [s.firstName, s.lastName].filter(Boolean).join(" ") || s.email || s.id,
      email: s.email ?? "",
      isTeacher: s.isTeacher ?? false,
    }));
  }),

  /**
   * Real school-wide counts for the broadcast role selector UI.
   * Matches the logic used by resolveRecipients so counts are accurate.
   */
  broadcastStats: protectedProcedure.query(async ({ ctx }) => {
    const validEmail = { contains: "@" };
    const notExample = { email: { endsWith: "example.com" } };
    const [parentCount, staffCount, studentCount] = await Promise.all([
      ctx.db.contact.count({
        where: {
          schoolId: ctx.schoolId,
          isActive: true,
          email: validEmail,
          NOT: notExample,
          studentContacts: {
            some: {
              student: {
                isActive: true,
                enrollments: { some: { schoolYearId: ctx.schoolYearId } },
              },
            },
          },
        },
      }),
      ctx.db.staff.count({
        where: {
          schoolId: ctx.schoolId,
          isActive: true,
          email: validEmail,
          NOT: notExample,
        },
      }),
      ctx.db.student.count({
        where: {
          schoolId: ctx.schoolId,
          isActive: true,
          email: validEmail,
          NOT: notExample,
          enrollments: { some: { schoolYearId: ctx.schoolYearId } },
        },
      }),
    ]);
    return { parentCount, staffCount, studentCount };
  }),

  /**
   * Preview how many real recipients a target resolves to without saving.
   */
  previewCount: protectedProcedure
    .input(RecipientTargetSchema)
    .query(async ({ ctx, input }) => {
      const recipients = await resolveRecipients(
        ctx.db,
        ctx.schoolId,
        ctx.schoolYearId,
        input,
      );
      return { count: recipients.length };
    }),

  /**
   * Send a bulk email immediately via SES.
   * Creates BulkEmail + BulkEmailRecipient rows for full traceability.
   */
  send: protectedProcedure
    .input(
      z.object({
        subject: z.string().min(1),
        body: z.string().min(1),
        recipientTarget: RecipientTargetSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const recipients = await resolveRecipients(
        ctx.db,
        ctx.schoolId,
        ctx.schoolYearId,
        input.recipientTarget,
      );

      if (recipients.length === 0) {
        throw new Error("No recipients with valid email addresses found.");
      }

      // Create BulkEmail record first (SENDING state)
      const bulkEmail = await ctx.db.bulkEmail.create({
        data: {
          subject: input.subject,
          body: input.body,
          status: "SENDING",
          senderId: ctx.session.user.id,
          schoolId: ctx.schoolId,
          recipientTarget: input.recipientTarget,
          recipientCount: recipients.length,
          recipients: {
            createMany: {
              data: recipients.map((r) => ({
                email: r.email,
                name: r.name,
                recipientType: r.recipientType,
                recipientId: r.recipientId,
                status: "queued",
              })),
            },
          },
        },
      });

      // Broadcast via SES
      const broadcastId = `bulk-${bulkEmail.id}-${nanoid(6)}`;
      const result = await broadcastEmail({
        broadcastId,
        recipients: recipients.map((r) => r.email),
        subject: input.subject,
        html: input.body,
      });

      // Update status
      await ctx.db.bulkEmail.update({
        where: { id: bulkEmail.id },
        data: {
          status: result.failedCount === recipients.length ? "FAILED" : "SENT",
          sentAt: new Date(),
        },
      });

      ctx.activityLog.log({
        action: ActivityAction.CREATE,
        targetType: ActivityTargetType.DOCUMENT,
        targetId: bulkEmail.id,
        description: `${ctx.activityLog.actor} a envoyé un e-mail groupé "<strong>${input.subject}</strong>" à ${recipients.length} destinataire(s)`,
        metadata: {
          subject: input.subject,
          recipientCount: recipients.length,
          broadcastId,
        },
      });

      return {
        id: bulkEmail.id,
        recipientCount: recipients.length,
        enqueuedCount: result.enqueuedCount,
        failedCount: result.failedCount,
      };
    }),

  /**
   * Save a draft without sending.
   */
  saveDraft: protectedProcedure
    .input(
      z.object({
        subject: z.string(),
        body: z.string(),
        recipientTarget: RecipientTargetSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const bulkEmail = await ctx.db.bulkEmail.create({
        data: {
          subject: input.subject || "(No subject)",
          body: input.body,
          status: "DRAFT",
          senderId: ctx.session.user.id,
          schoolId: ctx.schoolId,
          recipientTarget: input.recipientTarget,
          recipientCount: 0,
        },
      });
      return { id: bulkEmail.id };
    }),

  /**
   * List sent emails and drafts for the current school.
   */
  list: protectedProcedure
    .input(
      z.object({
        folder: z.enum(["sent", "drafts", "all"]).default("all"),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const where: Record<string, unknown> = {
        schoolId: ctx.schoolId,
        senderId: ctx.session.user.id,
      };

      if (input.folder === "sent") {
        where.status = "SENT";
      } else if (input.folder === "drafts") {
        where.status = "DRAFT";
      }

      const [emails, total] = await ctx.db.$transaction([
        ctx.db.bulkEmail.findMany({
          where,
          select: {
            id: true,
            subject: true,
            body: true,
            status: true,
            recipientCount: true,
            sentAt: true,
            createdAt: true,
            recipientTarget: true,
            sender: { select: { name: true } },
          },
          orderBy: { createdAt: "desc" },
          skip: input.offset,
          take: input.limit,
        }),
        ctx.db.bulkEmail.count({ where }),
      ]);

      return {
        emails: emails.map((e) => ({
          ...e,
          preview: e.body.replace(/<[^>]+>/g, "").slice(0, 100),
        })),
        total,
      };
    }),

  /**
   * Get a single bulk email with recipient details.
   */
  get: protectedProcedure
    .input(z.string().min(1))
    .query(async ({ ctx, input }) => {
      const email = await ctx.db.bulkEmail.findFirstOrThrow({
        where: { id: input, schoolId: ctx.schoolId },
        include: {
          sender: { select: { id: true, name: true, email: true } },
          recipients: {
            orderBy: { createdAt: "asc" },
            take: 500,
          },
        },
      });
      return {
        ...email,
        preview: email.body.replace(/<[^>]+>/g, "").slice(0, 100),
      };
    }),
} satisfies TRPCRouterRecord;
