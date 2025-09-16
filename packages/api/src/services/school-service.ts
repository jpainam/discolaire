import { db } from "../db";

export const schoolService = {
  get: async (id: string) => {
    return db.school.findUnique({
      where: {
        id,
      },
    });
  },
};
