import { db } from "@repo/db";

export const userService = {
  getPermissions: async (userId: string) => {
    const user = await db.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new Error("User not found");
    }
    const userWithRolesAndPolicies = await db.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: {
              include: {
                policies: {
                  include: {
                    policy: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Extract and format policies from the nested structure
    const policies = userWithRolesAndPolicies?.roles.flatMap((userRole) =>
      userRole.role.policies.map((rolePolicy) => ({
        actions: rolePolicy.policy.actions,
        effect: rolePolicy.policy.effect,
        resources: rolePolicy.policy.resources,
        condition: rolePolicy.policy.condition,
        schoolId: user.schoolId,
      })),
    );

    return policies;
  },

  updateProfile: async (
    userId: string,
    name: string,
    email: string | null,
    avatar: string | null,
  ) => {
    return db.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        avatar,
      },
    });
  },
  attachRoles: async (userId: string, roleId: string | string[]) => {
    if (Array.isArray(roleId)) {
      return db.userRole.createMany({
        skipDuplicates: true,
        data: roleId.map((id) => ({
          userId,
          roleId: id,
        })),
      });
    } else {
      return db.userRole.create({
        data: {
          userId,
          roleId,
        },
      });
    }
  },
};
