import { render } from "@react-email/render";
import { db } from "@repo/db";
import {
  AbsenceEmail,
  ChatterEmail,
  ConsigneEmail,
  ExclusionEmail,
  LatenessEmail,
} from "@repo/transactional";
import i18next from "i18next";
import { z } from "zod";
import { getSession } from "~/auth/server";
import { getServerTranslations } from "~/i18n/server";

import { caller } from "~/trpc/server";

const dateFormat = Intl.DateTimeFormat(i18next.language, {
  month: "short",
  weekday: "short",
  day: "numeric",
});

const schema = z.object({
  id: z.coerce.number(),
  type: z.enum(["absence", "chatter", "consigne", "lateness", "exclusion"]),
});

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return new Response("Not authenticated", { status: 401 });
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const reqBody = await req.json();
    const result = schema.safeParse(reqBody);
    if (!result.success) {
      const error = result.error.errors.map((e) => e.message).join(", ");
      return new Response(error, { status: 400 });
    }
    const { id, type } = result.data;
    let emailData: { title: string; body: string; studentId: string } | null =
      null;

    switch (type) {
      case "absence":
        emailData = await getAbsenceEmail(id);
        break;
      case "chatter":
        emailData = await getChatterEmail(id);
        break;
      case "consigne":
        emailData = await getConsigneEmail(id);
        break;
      case "lateness":
        emailData = await getLatenessEmail(id);
        break;
      case "exclusion":
        emailData = await getExclusionEmail(id);
        break;
      default:
        return new Response("Invalid type", { status: 400 });
    }

    const { title, body, studentId } = emailData;
    await completeSend(title, body, studentId);
    return new Response("OK", { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response(`An error occurred`, { status: 500 });
  }
}

async function completeSend(title: string, body: string, studentId: string) {
  const studentContacts = await caller.student.contacts(studentId);
  if (studentContacts.length === 0) {
    return new Response("Student has no contact", { status: 404 });
  }

  const contactEmails = studentContacts
    .map((c) => c.contact.email)
    .filter((v) => v != null);
  await caller.messaging.sendEmail({
    subject: title,
    to: contactEmails,
    body: body,
  });
}

async function getStudentAndSchool(studentId: string) {
  const student = await db.student.findUniqueOrThrow({
    where: {
      id: studentId,
    },
  });
  const school = await db.school.findUniqueOrThrow({
    where: {
      id: student.schoolId,
    },
  });
  return { student, school };
}
async function getAbsenceEmail(id: number) {
  const absence = await db.absence.findUniqueOrThrow({
    where: {
      id,
    },
  });
  const { t } = await getServerTranslations();
  const { student, school } = await getStudentAndSchool(absence.studentId);
  const title = t("email_absence_title", { name: student.lastName });
  const body = await render(
    AbsenceEmail({
      studentName: student.lastName ?? student.firstName ?? "",
      date: dateFormat.format(absence.date),
      school: {
        id: school.id,
        logo: school.logo,
        name: school.name,
      },
      title: title,
    }),
  );
  return { title, body, studentId: student.id };
}

async function getChatterEmail(id: number) {
  const chatter = await db.chatter.findUniqueOrThrow({
    where: {
      id,
    },
  });
  const { t } = await getServerTranslations();
  const { student, school } = await getStudentAndSchool(chatter.studentId);
  const title = t("email_chatter_title", { name: student.lastName });
  const body = await render(
    ChatterEmail({
      title: title,
      studentName: student.lastName ?? student.firstName ?? "",
      school: {
        id: school.id,
        logo: school.logo,
        name: school.name,
      },
    }),
  );
  return { title, body, studentId: student.id };
}
async function getConsigneEmail(id: number) {
  const consigne = await db.consigne.findUniqueOrThrow({
    where: {
      id,
    },
  });
  const { t } = await getServerTranslations();
  const { student, school } = await getStudentAndSchool(consigne.studentId);
  const title = t("email_consigne_title", { name: student.lastName });
  const body = await render(
    ConsigneEmail({
      title: title,
      date: dateFormat.format(consigne.date),
      motif: consigne.task,
      studentName: student.lastName ?? student.firstName ?? "",
      school: {
        id: school.id,
        logo: school.logo,
        name: school.name,
      },
    }),
  );
  return { title, body, studentId: student.id };
}
async function getLatenessEmail(id: number) {
  const lateness = await db.lateness.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const { t } = await getServerTranslations();
  const { student, school } = await getStudentAndSchool(lateness.studentId);
  const title = t("email_title_lateness", { name: student.lastName });
  const body = await render(
    LatenessEmail({
      title: title,
      date: dateFormat.format(lateness.date),
      studentName: student.lastName ?? student.firstName ?? "",
      school: {
        id: school.id,
        logo: school.logo,
        name: school.name,
      },
    }),
  );
  return { title, body, studentId: student.id };
}

async function getExclusionEmail(id: number) {
  const exclusion = await db.exclusion.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const { t } = await getServerTranslations();
  const { student, school } = await getStudentAndSchool(exclusion.studentId);
  const title = t("email_title_exclusion", { name: student.lastName });
  const body = await render(
    ExclusionEmail({
      title: title,
      motif: exclusion.reason,
      startDate: dateFormat.format(exclusion.startDate),
      endDate: dateFormat.format(exclusion.endDate),
      studentName: student.lastName ?? student.firstName ?? "",
      school: {
        id: school.id,
        logo: school.logo,
        name: school.name,
      },
    }),
  );
  return { title, body, studentId: student.id };
}
