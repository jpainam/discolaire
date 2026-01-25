import type { Prisma, PrismaClient } from "@repo/db";

import { env } from "../env";
import { ClassroomService } from "./classroom-service";
import { TrimestreService } from "./trimestre-service";

export class AttendanceService {
  private db: PrismaClient;
  private classroom: ClassroomService;
  private trimestre: TrimestreService;
  constructor(db: PrismaClient) {
    this.db = db;
    this.classroom = new ClassroomService(db);
    this.trimestre = new TrimestreService(db);
  }
  async getDisciplineForTerms(opts: {
    classroomId: string;
    termIds: string[];
  }) {
    const students = await this.classroom.getStudents(opts.classroomId);
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
        exclusion: number;
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
        exclusion: 0,
      });

    const rows = await this.db.attendance.findMany({
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
        exclusion: 0,
      };
      totalsByStudent.set(row.studentId, addTotals(prev, parsed));
    }
    return totalsByStudent;
    // return Object.fromEntries(totalsByStudent.entries()) as Record<
    //   string,
    //   DisciplineTotals
    // >;
  }
}
export function attendanceToData(data: Prisma.JsonValue) {
  const d = (data ?? {}) as Prisma.JsonObject;
  return {
    absence: Number(d.absence ?? 0),
    justifiedAbsence: Number(d.justifiedAbsence ?? 0),
    chatter: Number(d.chatter ?? 0),
    consigne: Number(d.consigne ?? 0),
    late: Number(d.late ?? 0),
    justifiedLate: Number(d.justifiedLate ?? 0),
    exclusion: Number(d.exclusion ?? 0),
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
    exclusion: number;
  },
  b: {
    absence: number;
    justifiedAbsence: number;
    chatter: number;
    late: number;
    justifiedLate: number;
    consigne: number;
    exclusion: number;
  },
) {
  return {
    absence: a.absence + b.absence,
    justifiedAbsence: a.justifiedAbsence + b.justifiedAbsence,
    chatter: a.chatter + b.chatter,
    late: a.late + b.late,
    justifiedLate: a.justifiedLate + b.justifiedLate,
    consigne: a.consigne + b.consigne,
    exclusion: a.exclusion + b.exclusion,
  };
}

export async function sendAttendanceEmail(opts: {
  id: number;
  type: "absence" | "chatter";
  baseUrl: string;
}) {
  const { id, type, baseUrl } = opts;
  try {
    const response = await fetch(`${baseUrl}/api/emails/attendance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.DISCOLAIRE_API_KEY,
      },
      body: JSON.stringify({ id, type }),
    });
    if (!response.ok) {
      throw new Error(`Failed to send email: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error sending attendance email:", error);
  }
}
