import { z } from "zod/v4";

import { ClassroomTimetableEmail } from "@repo/transactional";
import { sendEmail } from "@repo/utils/resend";

import { getSession } from "~/auth/server";
import { caller } from "~/trpc/server";

const bodySchema = z.object({
  classroomId: z.string().min(1),
  recipientType: z.enum(["teachers", "parents", "students"]),
  staffId: z.string().min(1).optional().nullable(),
});

function getTeacherName(teacher: {
  prefix?: string | null;
  firstName?: string | null;
  lastName?: string | null;
}) {
  return [teacher.prefix, teacher.lastName, teacher.firstName]
    .filter(Boolean)
    .join(" ")
    .trim();
}

function getStudentName(student: {
  firstName?: string | null;
  lastName?: string | null;
}) {
  return [student.lastName, student.firstName].filter(Boolean).join(" ").trim();
}

function buildWeeklyTimetable(
  timetableEvents: Awaited<ReturnType<typeof caller.classroom.timetables>>,
) {
  const weekdayFormatter = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
  });
  const timeFormatter = new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const slotsMap = new Map<
    string,
    {
      title: string;
      dayLabel: string;
      startTime: string;
      endTime: string;
      description: string;
      teacherName: string | null;
      location: string;
      weekdayIndex: number;
      startMinutes: number;
    }
  >();

  for (const event of timetableEvents) {
    const startDate = new Date(event.start);
    const endDate = new Date(event.end);
    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      continue;
    }

    const weekdayIndex = startDate.getDay();
    const startTime = timeFormatter.format(startDate);
    const endTime = timeFormatter.format(endDate);
    const teacherName = event.metadata.teacherName ?? null;

    const key = [
      weekdayIndex,
      startTime,
      endTime,
      event.title,
      teacherName ?? "",
      event.location,
    ].join("|");

    if (!slotsMap.has(key)) {
      slotsMap.set(key, {
        title: event.title,
        dayLabel: weekdayFormatter.format(startDate),
        startTime,
        endTime,
        description: event.description,
        teacherName,
        location: event.location,
        weekdayIndex,
        startMinutes: startDate.getHours() * 60 + startDate.getMinutes(),
      });
    }
  }

  return Array.from(slotsMap.values())
    .sort((a, b) => {
      if (a.weekdayIndex === b.weekdayIndex) {
        return a.startMinutes - b.startMinutes;
      }
      return a.weekdayIndex - b.weekdayIndex;
    })
    .map(
      ({ weekdayIndex: _weekdayIndex, startMinutes: _startMinutes, ...x }) => x,
    );
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const body = await req.json();
    const result = bodySchema.safeParse(body);
    if (!result.success) {
      const error = z.treeifyError(result.error).errors;
      return new Response(JSON.stringify(error), { status: 400 });
    }

    const { classroomId, recipientType, staffId } = result.data;

    const [classroom, school, timetableEvents] = await Promise.all([
      caller.classroom.get(classroomId),
      caller.school.getSchool(),
      caller.classroom.timetables(classroomId),
    ]);

    if (timetableEvents.length === 0) {
      return new Response("No timetable found for this classroom", {
        status: 400,
      });
    }

    const skippedNoEmail: string[] = [];
    const recipientsByEmail = new Map<
      string,
      { email: string; name: string | undefined }
    >();

    if (recipientType === "teachers") {
      const teachers = await caller.classroom.teachers(classroomId);
      const selectedTeachers = staffId
        ? teachers.filter((teacher) => teacher.id === staffId)
        : teachers;

      if (selectedTeachers.length === 0) {
        return new Response("No teacher found for this classroom", {
          status: 404,
        });
      }

      for (const teacher of selectedTeachers) {
        const email = (teacher.user?.email ?? teacher.email ?? "").trim();
        const name = getTeacherName(teacher) || undefined;
        if (!email) {
          skippedNoEmail.push(name ?? teacher.id);
          continue;
        }
        if (!recipientsByEmail.has(email)) {
          recipientsByEmail.set(email, { email, name });
        }
      }
    } else {
      const students = await caller.classroom.students(classroomId);
      if (students.length === 0) {
        return new Response("No student found for this classroom", {
          status: 404,
        });
      }

      if (recipientType === "students") {
        for (const student of students) {
          const email = (student.user?.email ?? "").trim();
          const name = getStudentName(student) || undefined;
          if (!email) {
            skippedNoEmail.push(name ?? student.id);
            continue;
          }
          if (!recipientsByEmail.has(email)) {
            recipientsByEmail.set(email, { email, name });
          }
        }
      } else {
        const contactLists = await Promise.all(
          students.map((student) => caller.student.contacts(student.id)),
        );

        for (const contacts of contactLists) {
          for (const studentContact of contacts) {
            const contact = studentContact.contact;
            const email = (contact.user?.email ?? contact.email ?? "").trim();
            const name =
              [contact.lastName, contact.firstName].filter(Boolean).join(" ") ||
              undefined;
            if (!email) {
              skippedNoEmail.push(name ?? contact.id);
              continue;
            }
            if (!recipientsByEmail.has(email)) {
              recipientsByEmail.set(email, { email, name });
            }
          }
        }
      }
    }

    const recipients = Array.from(recipientsByEmail.values());
    if (recipients.length === 0) {
      return new Response(
        `No recipient email found for selected ${recipientType}`,
        {
          status: 400,
        },
      );
    }

    const timetable = buildWeeklyTimetable(timetableEvents);
    const subject = `Emploi du temps ${classroom.name} - ${school.name}`;

    await Promise.all(
      recipients.map(async (recipient) => {
        await sendEmail({
          from: `${school.name} <contact@discolaire.com>`,
          to: recipient.email,
          subject,
          react: ClassroomTimetableEmail({
            schoolName: school.name,
            classroomName: classroom.name,
            recipientName: recipient.name,
            timetable,
          }),
        });
      }),
    );

    return Response.json({
      success: true,
      classroomId,
      recipientType,
      sent: recipients.length,
      skippedNoEmail,
      mode: recipientType === "teachers" && staffId ? "single" : "all",
    });
  } catch (error) {
    console.error(error);
    return new Response("An error occurred", { status: 500 });
  }
}
