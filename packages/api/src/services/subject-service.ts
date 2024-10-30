import { db } from "@repo/db";

export const subjectService = {
  addPermission: async ({
    userId,
    subjectId,
    schoolId,
    resources,
    byId,
  }: {
    userId: string;
    subjectId: number;
    resources: string[];
    schoolId: string;
    byId: string;
  }) => {
    const policyName = `${userId}-subject-${subjectId}`;
    const existingPolicy = await db.policy.findFirst({
      where: { name: policyName },
    });
    if (existingPolicy) {
      return existingPolicy;
    }
    return db.policy.create({
      data: {
        name: `${userId}-subject-${subjectId}`,
        actions: ["read:Read"],
        effect: "Allow",
        createdById: byId,
        resources: resources,
        condition: {
          in: JSON.stringify([{ var: "id" }, [subjectId]]),
        },
        schoolId: schoolId,
        users: {
          create: {
            userId: userId,
            createdById: byId,
          },
        },
      },
    });
  },
};
