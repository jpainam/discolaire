import { render } from "@react-email/render";
import { z } from "zod/v4";

import {
  AbsenceEmail,
  ChatterEmail,
  ConsigneEmail,
  ExclusionEmail,
  LatenessEmail,
} from "@repo/transactional";
import { sendEmail } from "@repo/utils/resend";

import { getSession } from "~/auth/server";
import { getServerTranslations } from "~/i18n/server";
import { db } from "~/lib/db";
import { caller } from "~/trpc/server";
import { logger } from "~/utils/logger";

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
      const pretty = z.prettifyError(result.error);
      return new Response(pretty, { status: 400 });
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
        return new Response(`Invalid type`, { status: 400 });
    }

    const { title, body, studentId } = emailData;
    await completeSend(title, body, studentId);
    return new Response("OK", { status: 200 });
  } catch (e) {
    logger.error(e);
    return new Response(`An error occurred`, { status: 500 });
  }
}

async function completeSend(title: string, body: string, studentId: string) {
  const studentContacts = await caller.student.contacts(studentId);
  if (studentContacts.length === 0) {
    return new Response("Student has no contact", { status: 404 });
  }

  const contactEmails = studentContacts
    .map((c) => c.contact.user?.email)
    .filter((v): v is string => !!v && v !== "");

  await sendEmail({
    from: "Discolaire <hi@discolaire.com>",
    to: contactEmails,
    subject: title,
    html: body,
    text: body.replace(/<[^>]+>/g, ""), // Simple text fallback
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
      date: absence.date,
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
      date: consigne.date,
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
      date: lateness.date,
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
      startDate: exclusion.startDate,
      endDate: exclusion.endDate,
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
