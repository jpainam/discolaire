import { headers } from "next/headers";

import { db } from "@repo/db";

import { env } from "../../env";

export const userService = {
  sendWelcomeEmail: async ({
    userId,
    email,
  }: {
    userId?: string;
    email?: string;
  }) => {
    let toEmail = email;
    if (userId) {
      const user = await db.user.findUniqueOrThrow({
        where: { id: userId },
      });
      if (user.email) toEmail = user.email;
    }
    if (!toEmail) return;
    void fetch(
      `${env.NEXT_PUBLIC_BASE_URL}/api/emails/welcome?email=${toEmail}`,
      {
        method: "GET",
        headers: await headers(),
      },
    );
  },
  getPermissions: async (userId: string) => {
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    const userWithRolesAndPolicies = await db.user.findUnique({
      where: { id: userId },
      include: {
        policies: {
          include: {
            policy: true,
          },
        },
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
    const rolePolicies = userWithRolesAndPolicies?.roles.flatMap((userRole) =>
      userRole.role.policies.map((rolePolicy) => ({
        actions: rolePolicy.policy.actions,
        effect: rolePolicy.policy.effect,
        resources: rolePolicy.policy.resources,
        condition: rolePolicy.policy.condition,
        schoolId: user?.schoolId ?? "UNKNOWN",
      })),
    );
    const userPolicies = userWithRolesAndPolicies?.policies.map(
      (userPolicy) => {
        return {
          actions: userPolicy.policy.actions,
          effect: userPolicy.policy.effect,
          resources: userPolicy.policy.resources,
          condition: userPolicy.policy.condition,
          schoolId: user?.schoolId ?? "UNKNOWN",
        };
      },
    );

    return [...(rolePolicies ?? []), ...(userPolicies ?? [])];
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
  updateAvatar: async ({
    userId,
    avatar,
  }: {
    userId?: string | null;
    avatar: string;
  }) => {
    if (!userId) {
      return;
    }
    return db.user.update({
      where: { id: userId },
      data: {
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

  deleteUsers: async (userIds: string[]) => {
    return db.user.deleteMany({
      where: {
        id: {
          in: userIds,
        },
      },
    });
  },

  validateUsername: async (username: string) => {
    const registeredUser = await db.user.findFirst({
      where: {
        username,
      },
    });
    if (registeredUser) {
      return {
        error: "Username already exists",
      };
    }
    return {
      error: null,
    };
  },
};
