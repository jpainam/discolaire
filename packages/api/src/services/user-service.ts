import { headers } from "next/headers";
import { generateRandomString } from "better-auth/crypto";

import type { Auth } from "@repo/auth";
import type { PrismaClient } from "@repo/db";

export class UserService {
  private db: PrismaClient;
  constructor(db: PrismaClient) {
    this.db = db;
  }

  private mergePermissions(
    permissions: {
      resource: string;
      effect: "allow" | "deny";
      condition?: Record<string, unknown> | null;
    }[],
  ) {
    const merged = new Map<
      string,
      {
        resource: string;
        effect: "allow" | "deny";
        condition?: Record<string, unknown> | null;
      }
    >();

    for (const permission of permissions) {
      const key = `${permission.resource}`;
      const existing = merged.get(key);
      if (!existing) {
        merged.set(key, permission);
        continue;
      }
      if (existing.effect === "deny") {
        if (permission.effect === "deny" && !existing.condition) {
          continue;
        }
        if (permission.effect === "deny" && !permission.condition) {
          merged.set(key, permission);
        }
        continue;
      }
      if (permission.effect === "deny") {
        merged.set(key, permission);
        continue;
      }
      if (!existing.condition && permission.condition) {
        continue;
      }
      if (existing.condition && !permission.condition) {
        merged.set(key, permission);
      }
    }

    return Array.from(merged.values());
  }
  private async getDirectPermissions(userId: string) {
    const user = await this.db.user.findUniqueOrThrow({
      where: { id: userId },
    });
    const perms = user.permissions as {
      resource: string;
      action: string;
      effect: string;
      condition?: Record<string, unknown> | null;
    }[];

    return perms.map((p) => {
      return {
        resource: `${p.resource}.${p.action}`.toLowerCase(),
        effect: p.effect.toLowerCase(),
        condition: p.condition,
      };
    });
  }
  async updatePermission({
    userId,
    resource,
    action,
    effect,
  }: {
    userId: string;
    resource: string;
    action: "read" | "update" | "create" | "delete";
    effect: "allow" | "deny";
  }) {
    const permissions = await this.getDirectPermissions(userId);

    let updatedPermissions = [];
    if (effect === "allow") {
      const newPermission = {
        resource,
        action,
        effect,
      };
      updatedPermissions = [...permissions, newPermission];
      if (
        newPermission.resource == "user" &&
        newPermission.action == "create"
      ) {
        await this.db.user.update({
          where: { id: userId },
          data: {
            role: "admin",
          },
        });
      }
    } else {
      updatedPermissions = permissions.filter(
        (perm) => !(perm.resource === resource),
      );
    }
    return this.db.user.update({
      where: { id: userId },
      data: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
        permissions: updatedPermissions as any,
      },
    });
  }
  async getEntity(userId: string, profile: "student" | "staff" | "contact") {
    if (profile == "staff") {
      const s = await this.db.staff.findFirst({
        where: {
          userId: userId,
        },
      });
      return {
        entityId: s?.id,
        entityType: "staff",
        lastName: s?.lastName,
        firstName: s?.firstName,
      };
    } else if (profile == "contact") {
      const c = await this.db.contact.findFirst({
        where: {
          userId: userId,
        },
      });
      return {
        entityId: c?.id,
        entityType: "contact",
        lastName: c?.lastName,
        firstName: c?.firstName,
      };
    } else {
      const s = await this.db.student.findFirst({
        where: {
          userId: userId,
        },
      });
      return {
        entityId: s?.id,
        entityType: "student",
        lastName: s?.lastName,
        firstName: s?.firstName,
      };
    }
  }
  deleteUsers(userIds: string[]) {
    return this.db.user.deleteMany({
      where: {
        id: {
          in: userIds,
        },
      },
    });
  }
  async validateUsername(username: string) {
    const registeredUser = await this.db.user.findFirst({
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
  }
  async getPermissions(userId: string) {
    const user = await this.db.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        permissions: true,
        userRole: {
          select: {
            permissionRoles: {
              select: {
                effect: true,
                condition: true,
                permission: {
                  select: {
                    resource: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    const perms = (user.permissions ?? []) as {
      resource: string;
      action: string;
      effect: string;
      condition?: Record<string, unknown> | null;
    }[];
    const directPermissions = perms.map((p) => {
      return {
        resource: `${p.resource}.${p.action}`.toLowerCase(),
        effect: p.effect.toLowerCase() as "allow" | "deny",
        condition: p.condition,
      };
    });
    const rolePermissions =
      user.userRole?.permissionRoles.map((permissionRole) => {
        return {
          effect: permissionRole.effect,
          resource: permissionRole.permission.resource,
          condition: permissionRole.condition,
        };
      }) ?? [];

    return this.mergePermissions([
      ...directPermissions,
      ...(rolePermissions as {
        resource: string;
        effect: "allow" | "deny";
        condition?: Record<string, unknown> | null;
      }[]),
    ]);
  }
  async attachUser({
    entityId,
    entityType,
    userId,
  }: {
    entityId: string;
    entityType: "staff" | "contact" | "student";
    userId: string;
  }) {
    if (entityType === "staff") {
      const d = await this.db.staff.update({
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
      const dd = await this.db.contact.update({
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

    const ddd = await this.db.student.update({
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
  async getByEntity({
    entityId,
    entityType,
  }: {
    entityId: string;
    entityType: "staff" | "student" | "contact";
  }) {
    if (entityType == "staff") {
      const dd = await this.db.staff.findUniqueOrThrow({
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
      const dd = await this.db.student.findUniqueOrThrow({
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

    const dd = await this.db.contact.findFirstOrThrow({
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
  async createUser({
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
    await this.attachUser({
      userId: newUser.user.id,
      entityId: entityId,
      entityType: profile,
    });

    await authApi.requestPasswordReset({
      body: {
        email: newUser.user.email,
        redirectTo: `/auth/complete-registration/${newUser.user.id}`,
      },
      headers: await headers(),
    });
    return newUser.user;
  }
}
