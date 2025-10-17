import { TRPCError } from "@trpc/server";

import type { Prisma } from "@repo/db";

import { db } from "../db";
import { env } from "../env";
import { classroomService } from "./classroom-service";

export function attendanceToData(data: Prisma.JsonValue) {
  const d = (data ?? {}) as Prisma.JsonObject;
  return {
    absence: Number(d.absence ?? 0),
    justifiedAbsence: Number(d.justifiedAbsence ?? 0),
    chatter: Number(d.chatter ?? 0),
    consigne: Number(d.consigne ?? 0),
    late: Number(d.late ?? 0),
    justifiedLate: Number(d.justifiedLate ?? 0),
  };
}
function addTotals(
  a: {
    absence: number;
    justifiedAbsence: number;
    chatter: number;
    late: number;
    justifiedLate: number;
    consigne: number;
  },
  b: {
    absence: number;
    justifiedAbsence: number;
    chatter: number;
    late: number;
    justifiedLate: number;
    consigne: number;
  },
) {
  return {
    absence: a.absence + b.absence,
    justifiedAbsence: a.justifiedAbsence + b.justifiedAbsence,
    chatter: a.chatter + b.chatter,
    late: a.late + b.late,
    justifiedLate: a.justifiedLate + b.justifiedLate,
    consigne: a.consigne + b.consigne,
  };
}

export async function getDisciplineForTerms(opts: {
  classroomId: string;
  termIds: string[];
}) {
  const students = await classroomService.getStudents(opts.classroomId);
  const studentIds = students.map((s: { id: string }) => s.id);
  //if (studentIds.length === 0) return {};

  const totalsByStudent = new Map<
    string,
    {
      absence: number;
      justifiedAbsence: number;
      chatter: number;
      late: number;
      justifiedLate: number;
      consigne: number;
    }
  >();
  for (const id of studentIds)
    totalsByStudent.set(id, {
      absence: 0,
      justifiedAbsence: 0,
      chatter: 0,
      late: 0,
      justifiedLate: 0,
      consigne: 0,
    });

  const rows = await db.attendance.findMany({
    where: {
      studentId: { in: studentIds },
      termId: { in: opts.termIds },
    },
    select: {
      studentId: true,
      data: true,
    },
  });
  for (const row of rows) {
    const parsed = attendanceToData(row.data);
    const prev = totalsByStudent.get(row.studentId) ?? {
      absence: 0,
      justifiedAbsence: 0,
      chatter: 0,
      late: 0,
      justifiedLate: 0,
      consigne: 0,
    };
    totalsByStudent.set(row.studentId, addTotals(prev, parsed));
  }
  return totalsByStudent;
  // return Object.fromEntries(totalsByStudent.entries()) as Record<
  //   string,
  //   DisciplineTotals
  // >;
}

export async function getTrimesterTermIds(
  trimestreId: "trim1" | "trim2" | "trim3",
  schoolYearId: string,
) {
  const terms = await db.term.findMany({
    where: { schoolYearId },
    select: { id: true, order: true },
  });

  if (terms.length < 6) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Expected ≥6 terms but found ${terms.length} for schoolYearId=${schoolYearId}`,
    });
  }

  const sorted = terms.slice().sort((a, b) => a.order - b.order);
  const offset = trimestreId === "trim1" ? 0 : trimestreId === "trim2" ? 2 : 4;
  const seq1 = sorted[offset]?.id;
  const seq2 = sorted[offset + 1]?.id;

  if (!seq1 || !seq2) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Trimestre ${trimestreId} not found.`,
    });
  }

  return [seq1, seq2] as const;
}

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
