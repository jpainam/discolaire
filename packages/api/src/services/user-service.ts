import { headers } from "next/headers";
import { generateRandomString } from "better-auth/crypto";

import type { Auth } from "@repo/auth";
import type { Prisma } from "@repo/db";
import { db } from "@repo/db";

export const userService = {
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

  updatePermission: async ({
    userId,
    resource,
    action,
    effect,
  }: {
    userId: string;
    resource: string;
    action: "Read" | "Update" | "Create" | "Delete";
    effect: "Allow" | "Deny";
  }) => {
    const permissions = await getPermissions(userId);

    let updatedPermissions = [];
    if (effect === "Allow") {
      const newPermission = {
        resource,
        action,
        effect,
      };
      updatedPermissions = [...permissions, newPermission];
      if (
        newPermission.resource == "user" &&
        newPermission.action == "Create"
      ) {
        await db.user.update({
          where: { id: userId },
          data: {
            role: "admin",
          },
        });
      }
    } else {
      updatedPermissions = permissions.filter(
        (perm) => !(perm.resource === resource && perm.action === action),
      );
    }
    return db.user.update({
      where: { id: userId },
      data: {
        permissions: updatedPermissions as unknown as Prisma.JsonArray,
      },
    });
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

export async function getPermissions(userId: string) {
  const user = await db.user.findUniqueOrThrow({
    where: { id: userId },
  });

  return (user.permissions ?? []) as {
    resource: string;
    action: "Read" | "Update" | "Create" | "Delete";
    effect: "Allow" | "Deny";
    condition?: Record<string, unknown> | null;
  }[];
}

export async function attachUser({
  entityId,
  entityType,
  userId,
}: {
  entityId: string;
  entityType: "staff" | "contact" | "student";
  userId: string;
}) {
  if (entityType === "staff") {
    const d = await db.staff.update({
      where: {
        id: entityId,
      },
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
    return {
      name: `${d.lastName} ${d.firstName}`,
    };
  }

  if (entityType === "contact") {
    const dd = await db.contact.update({
      where: {
        id: entityId,
      },
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
    return {
      name: `${dd.lastName} ${dd.firstName}`,
    };
  }

  const ddd = await db.student.update({
    where: {
      id: entityId,
    },
    data: {
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
  return {
    name: `${ddd.lastName} ${ddd.firstName}`,
  };
}

export async function getByEntity({
  entityId,
  entityType,
}: {
  entityId: string;
  entityType: "staff" | "student" | "contact";
}) {
  if (entityType == "staff") {
    const dd = await db.staff.findUniqueOrThrow({
      where: {
        id: entityId,
      },
      include: {
        user: true,
      },
    });
    return {
      name: `${dd.lastName} ${dd.firstName}`,
      id: dd.id,
      userId: dd.userId,
      email: dd.user?.email,
      entityType: "staff",
    };
  }
  if (entityType == "student") {
    const dd = await db.student.findUniqueOrThrow({
      where: {
        id: entityType,
      },
      include: {
        user: true,
      },
    });
    return {
      name: `${dd.lastName} ${dd.firstName}`,
      id: dd.id,
      userId: dd.userId,
      email: dd.user?.email,
      entityType: "student",
    };
  }

  const dd = await db.contact.findFirstOrThrow({
    where: {
      id: entityId,
    },
    include: {
      user: true,
    },
  });
  return {
    name: `${dd.lastName} ${dd.firstName}`,
    id: dd.id,
    userId: dd.userId,
    entityType: "contact",
    email: dd.user?.email,
  };
}

export async function createUser({
  email,
  username,
  authApi,
  entityId,
  password,
  profile,
  schoolId,
  name,
  isActive,
}: {
  email?: string;
  username: string;
  entityId: string;
  name: string;
  authApi: Auth["api"];
  password?: string;
  profile: "student" | "staff" | "contact";
  schoolId: string;
  isActive?: boolean;
}) {
  const finalEmail = email?.trim() ? email : `${username}@discolaire.com`;
  const newUser = await authApi.signUpEmail({
    body: {
      email: finalEmail,
      username: username.toLowerCase(),
      name: name,
      profile: profile,
      schoolId: schoolId,
      password: password ?? generateRandomString(12),
      isActive: isActive ?? true,
    },
    headers: await headers(),
  });
  await attachUser({
    userId: newUser.user.id,
    entityId: entityId,
    entityType: profile,
  });

  await authApi.forgetPassword({
    body: {
      email: newUser.user.email,
      redirectTo: `/auth/complete-registration/${newUser.user.id}`,
    },
    headers: await headers(),
  });
  return newUser.user;
}
