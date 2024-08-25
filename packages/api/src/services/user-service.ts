import { db } from "@acme/db";

export const userService = {
  getPermissions: async (userId: string) => {
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
        schoolId: "IPW",
      })),
    );

    return policies;
  },
};
