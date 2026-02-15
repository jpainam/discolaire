import type { PrismaClient } from "@repo/db";

import { StudentService } from "./student-service";

export class AcademicSnapshotService {
  private db: PrismaClient;
  private student: StudentService;

  constructor(db: PrismaClient) {
    this.db = db;
    this.student = new StudentService(db);
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
  async get(params: { studentId: string; schoolYearId: string }) {
    const classroom = await this.student.getClassroom(
      params.studentId,
      params.schoolYearId,
    );

    if (!classroom) {
      return [];
    }
    const snapshots = await this.db.studentAcademicSnapshot.findMany({
      where: {
        studentId: params.studentId,
        classroomId: classroom.id,
        status: "READY",
        term: {
          schoolYearId: params.schoolYearId,
        },
      },
      include: {
        term: {
          select: {
            id: true,
            name: true,
            shortName: true,
            order: true,
            startDate: true,
          },
        },
      },
    });

    return snapshots
      .sort((a, b) => {
        return (
          a.term.order - b.term.order ||
          a.term.startDate.getTime() - b.term.startDate.getTime()
        );
      })
      .map((snapshot) => ({
        termId: snapshot.termId,
        termName: snapshot.term.name,
        termShortName: snapshot.term.shortName,
        termOrder: snapshot.term.order,
        average: snapshot.average,
        rank: snapshot.rank,
        createdAt: snapshot.createdAt,
        updatedAt: snapshot.updatedAt,
      }));
  }
}
