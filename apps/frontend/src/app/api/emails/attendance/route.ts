import { render } from "@react-email/render";
import { z } from "zod";

import { auth } from "@repo/auth";
import { db } from "@repo/db";
import { getServerTranslations } from "@repo/i18n/server";
import { AttendanceEmail } from "@repo/transactional";

import { api } from "~/trpc/server";

const schema = z.object({
  id: z.coerce.number(),
  type: z.enum(["absence", "chatter", "consigne", "lateness", "exclusion"]),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return new Response("Not authenticated", { status: 401 });
    }
    const body = await req.json();
    const result = schema.safeParse(body);
    if (!result.success) {
      const error = result.error.errors.map((e) => e.message).join(", ");
      return new Response(error, { status: 400 });
    }
    const { id, type } = result.data;

    switch (type) {
      case "absence":
        await sendAbsenceEmail(id);
        break;
      case "chatter":
        await sendChatterEmail(id);
        break;
      case "consigne":
        await sendConsigneEmail(id);
        break;
      case "lateness":
        await sendLatenessEmail(id);
        break;
      case "exclusion":
        await sendExclusionEmail(id);
        break;
      default:
        return new Response("Invalid type", { status: 400 });
    }
    return new Response("OK", { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response(`An error occurred`, { status: 500 });
  }
}

async function completeSend({
  studentId,
  title,
}: {
  studentId: string;
  title: string;
}) {
  const student = await db.student.findUniqueOrThrow({
    where: {
      id: studentId,
    },
  });
  const studentContacts = await api.student.contacts(student.id);
  if (studentContacts.length === 0) {
    return new Response("Student has no contact", { status: 404 });
  }

  const school = await db.school.findUniqueOrThrow({
    where: {
      id: student.schoolId,
    },
  });
  const { i18n } = await getServerTranslations();
  const emailBody = await render(
    AttendanceEmail({
      studentName: student.lastName ?? "",
      parentName: "",
      locale: i18n.language,
      school: {
        id: school.id,
        logo: school.logo,
        name: school.name,
      },
      title: title,
    }),
  );
  console.log(emailBody);
  await api.messaging.sendEmail({
    subject: title,
    to: studentContacts.map((c) => c.contact.email).filter((v) => v !== null),
    body: emailBody,
  });
}
async function sendAbsenceEmail(id: number) {
  const absence = await db.absence.findUniqueOrThrow({
    where: {
      id,
    },
  });
  await completeSend({
    title: "Absence",
    studentId: absence.studentId,
  });
}

async function sendChatterEmail(id: number) {
  const chatter = await db.chatter.findUniqueOrThrow({
    where: {
      id,
    },
  });
  await completeSend({
    title: "Chatter",

    studentId: chatter.studentId,
  });
}
async function sendConsigneEmail(id: number) {
  const consigne = await db.consigne.findUniqueOrThrow({
    where: {
      id,
    },
  });
  await completeSend({
    title: "Consigne",

    studentId: consigne.studentId,
  });
}

async function sendLatenessEmail(id: number) {
  const lateness = await db.lateness.findUniqueOrThrow({
    where: {
      id,
    },
  });
  await completeSend({
    title: "Lateness",

    studentId: lateness.studentId,
  });
}

async function sendExclusionEmail(id: number) {
  const exclusion = await db.exclusion.findUniqueOrThrow({
    where: {
      id,
    },
  });
  await completeSend({
    title: "Exclusion",

    studentId: exclusion.studentId,
  });
}
