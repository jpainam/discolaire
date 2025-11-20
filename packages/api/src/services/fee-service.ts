import { format } from "date-fns";

import type { PrismaClient } from "@repo/db";

export class FeeService {
  private db: PrismaClient;
  constructor(db: PrismaClient) {
    this.db = db;
  }
  async getMontlyFees(schoolYearId: string) {
    const fees = await this.db.fee.findMany({
      include: {
        journal: true,
      },
      where: {
        classroom: {
          schoolYearId: schoolYearId,
        },
      },
    });
    const result = fees.reduce((acc: Record<string, number>, fee) => {
      const month = format(fee.dueDate, "MMM");
      if (acc[month]) {
        acc[month] += 1; //fee.amount;
      } else {
        acc[month] = 1; //fee.amount;
      }
      return acc;
    }, {});
    return Object.keys(result).map((key) => {
      return {
        month: key,
        count: result[key],
      };
    });
  }
  async getAmountTrend(schoolYearId: string) {
    const fees = await this.db.fee.findMany({
      include: {
        classroom: true,
        journal: true,
      },
      where: {
        classroom: {
          schoolYearId: schoolYearId,
        },
      },
    });
    const result = fees.reduce((acc: Record<string, number>, fee) => {
      const name = fee.classroom.name;
      if (acc[name]) {
        acc[name] += fee.amount;
      } else {
        acc[name] = fee.amount;
      }
      return acc;
    }, {});
    return Object.keys(result).map((key) => {
      return {
        name: key,
        amount: result[key],
      };
    });
  }
}
export const feeService = {};
