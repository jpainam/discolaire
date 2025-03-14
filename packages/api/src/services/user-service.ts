import { headers } from "next/headers";
import { v4 as uuidv4 } from "uuid";

import type { Prisma } from "@repo/db";
import { hashPassword } from "@repo/auth/session";
import { db } from "@repo/db";

import type { Permission } from "..";
import { env } from "../env";

export const userService = {
  createAutoUser: async ({
    schoolId,
    profile,
    name,
  }: {
    schoolId: string;
    profile: string;
    name: string;
  }) => {
    // create user
    const userData = {
      username: uuidv4(),
      password: await hashPassword("password"),
      schoolId: schoolId,
      profile: profile,
      isActive: false,
      name: name,
    };
    return db.user.create({
      data: userData,
    });
  },
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

  updatePermission: async ({
    userId,
    resource,
    action,
    effect,
  }: {
    userId: string;
    resource: string;
    action: "Read" | "Write" | "Delete" | "Create";
    effect: "Allow" | "Deny";
  }) => {
    const permissions = await getPermissions(userId);
    const exists = permissions.some(
      (perm) => perm.resource === resource && perm.action === action,
    );

    if (exists) {
      return true;
    }
    let updatedPermissions = [];
    if (effect === "Allow") {
      const newPermission = {
        resource,
        action,
        effect,
      } as Permission;
      updatedPermissions = [...permissions, newPermission];
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

  return (user.permissions ?? []) as unknown as Permission[];
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
      email: d.email,
      name: `${d.lastName} ${d.firstName}`,
      avatar: d.avatar,
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
      email: dd.email,
      name: `${dd.lastName} ${dd.firstName}`,
      avatar: dd.avatar,
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
    email: ddd.email,
    name: `${ddd.lastName} ${ddd.firstName}`,
    avatar: ddd.avatar,
  };
}
