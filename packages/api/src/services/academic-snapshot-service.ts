import type { PrismaClient } from "@repo/db";

export class AcademicSnapshotService {
  private db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }
  async create(params: {
    classroomId: string;
    termId: string;
    reportcards: {
      studentId: string;
      rank: number;
      average: number;
    }[];
  }) {
    const { classroomId, termId, reportcards } = params;
    const studentIds = reportcards.map((r) => r.studentId);
    await this.db.studentAcademicSnapshot.deleteMany({
      where: {
        studentId: {
          in: studentIds,
        },
        classroomId,
        termId,
      },
    });
    const version = Math.floor(new Date().getTime() / 1000);
    const data = reportcards.map((r) => {
      return {
        studentId: r.studentId,
        rank: r.rank,
        status: "READY" as const,
        version,
        data: {},
        average: r.average,
        classroomId,
        termId,
      };
    });
    return this.db.studentAcademicSnapshot.createMany({
      data: data,
    });
  }
}
