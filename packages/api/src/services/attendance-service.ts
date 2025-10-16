import { TRPCError } from "@trpc/server";

import { Prisma } from "@repo/db";

import { db } from "../db";
import { env } from "../env";
import { classroomService } from "./classroom-service";

export async function sendAttendanceEmail(
  id: number,
  type: "absence" | "chatter",
) {
  try {
    const response = await fetch(
      `${env.NEXT_PUBLIC_BASE_URL}/api/emails/attendance`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": env.DISCOLAIRE_API_KEY,
        },
        body: JSON.stringify({ id, type }),
      },
    );
    if (!response.ok) {
      throw new Error(`Failed to send email: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error sending attendance email:", error);
  }
}
export async function getPeriodicAttendance({
  classroomId,
  termId,
}: {
  classroomId: string;
  termId: string;
}) {
  const studentIds: string[] = [];

  const students = await classroomService.getStudents(classroomId);
  studentIds.push(...students.map((st) => st.id));

  const attendances = await db.periodicAttendance.findMany({
    where: {
      termId,
      studentId: { in: studentIds },
    },
  });
  const raw = await attendances.map((at) => {
    const d = at.data as Prisma.JsonObject;
    return {
      ...at,
      absence: Number(d.absence ?? 0),
      justifiedAbsence: Number(d.justifiedAbsence ?? 0),
      lateness: Number(d.lateness ?? 0),
      justifiedLateness: Number(d.justifiedLateness ?? 0),
      chatter: Number(d.chatter ?? 0),
      consigne: Number(d.consigne ?? 0),
    };
  });
  const map = new Map<
    string,
    {
      absence: number;
      justifiedAbsence: number;
      lateness: number;
      justifiedLateness: number;
      chatter: number;
      consigne: number;
    }
  >();
  raw.forEach((at) => {
    map.set(at.studentId, {
      absence: at.absence,
      justifiedAbsence: at.justifiedAbsence,
      lateness: at.lateness,
      justifiedLateness: at.justifiedLateness,
      consigne: at.consigne,
      chatter: at.chatter,
    });
  });
  return { raw, map };
}

export async function getTrimesterTermIds(
  trimestreId: "trim1" | "trim2" | "trim3",
  schoolYearId: string,
) {
  const terms = await db.term.findMany({
    where: { schoolYearId: schoolYearId },
  });

  if (terms.length < 6) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Expected ≥6 terms but found ${terms.length} for  schoolYearId=${schoolYearId}`,
    });
  }

  const sorted = terms.slice().sort((a, b) => a.order - b.order);
  const offset = trimestreId === "trim1" ? 0 : trimestreId === "trim2" ? 2 : 4;
  const [seq1, seq2] = [sorted[offset]?.id, sorted[offset + 1]?.id];

  if (!seq1 || !seq2) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Trimestre ${trimestreId} not found.`,
    });
  }

  return [seq1, seq2] as const;
}
