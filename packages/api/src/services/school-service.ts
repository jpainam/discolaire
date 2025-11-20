import type { PrismaClient } from "@repo/db";

export class SchoolService {
  private db: PrismaClient;
  constructor(db: PrismaClient) {
    this.db = db;
  }
  get(id: string) {
    return this.db.school.findUnique({
      where: {
        id,
      },
    });
  }
}
