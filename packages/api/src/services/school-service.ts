import { db } from "@repo/db";

export const schoolService = {
  get: async (id: string) => {
    return db.school.findUnique({
      where: {
        id,
      },
    });
  },
};
