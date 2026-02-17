import { TRPCError } from "@trpc/server";
import { APIError } from "better-auth/api";
import { generateRandomString, hashPassword } from "better-auth/crypto";
import { v4 as uuidv4 } from "uuid";

import type { Auth } from "@repo/auth";
import type { PrismaClient } from "@repo/db";

import type { PubSubLogger } from "../pubsub-logger";
import { getBaseUrlFromHeaders } from "../lib/base-url";

type PermissionSource =
  | {
      type: "direct";
    }
  | {
      type: "role";
      role: {
        id: string;
        name: string;
      };
    };

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
      sources: PermissionSource[];
    }[],
  ) {
    const merged = new Map<
      string,
      {
        resource: string;
        effect: "allow" | "deny";
        condition?: Record<string, unknown> | null;
        sources: PermissionSource[];
      }
    >();

    for (const permission of permissions) {
      const key = `${permission.resource}`;
      const existing = merged.get(key);
      if (!existing) {
        merged.set(key, permission);
        continue;
      }
      const sourceKey = (source: PermissionSource) =>
        source.type === "direct" ? "direct" : `role:${source.role.id}`;
      const combinedSources = [
        ...existing.sources,
        ...permission.sources,
      ].filter(
        (source, index, self) =>
          self.findIndex((entry) => sourceKey(entry) === sourceKey(source)) ===
          index,
      );
      if (existing.effect === "deny") {
        if (permission.effect === "deny" && !existing.condition) {
          merged.set(key, { ...existing, sources: combinedSources });
          continue;
        }
        if (permission.effect === "deny" && !permission.condition) {
          merged.set(key, { ...permission, sources: combinedSources });
          continue;
        }
        merged.set(key, { ...existing, sources: combinedSources });
        continue;
      }
      if (permission.effect === "deny") {
        merged.set(key, { ...permission, sources: combinedSources });
        continue;
      }
      if (!existing.condition && permission.condition) {
        merged.set(key, { ...existing, sources: combinedSources });
        continue;
      }
      if (existing.condition && !permission.condition) {
        merged.set(key, { ...permission, sources: combinedSources });
        continue;
      }
      merged.set(key, { ...existing, sources: combinedSources });
    }

    return Array.from(merged.values());
  }
  /**
   * Normalizes a raw permission entry to the combined resource format.
   * Old format: { resource: "classroom", action: "Read" } → "classroom.read"
   * New format: { resource: "classroom.read" }             → "classroom.read"
   */
  private normalizePermissionResource(perm: {
    resource: string;
    action?: string;
  }): string {
    if (perm.action) {
      return `${perm.resource}.${perm.action}`.toLowerCase();
    }
    return perm.resource.toLowerCase();
  }

  private async getDirectPermissions(userId: string) {
    const user = await this.db.user.findUniqueOrThrow({
      where: { id: userId },
    });
    const perms = (user.permissions ?? []) as {
      resource: string;
      action?: string;
      effect: string;
      condition?: Record<string, unknown> | null;
    }[];

    return perms.map((p) => {
      return {
        resource: this.normalizePermissionResource(p),
        effect: p.effect.toLowerCase(),
        condition: p.condition,
      };
    });
  }

  async updatePermission({
    userId,
    resource,
    effect,
  }: {
    userId: string;
    resource: string;
    effect: "allow" | "deny";
  }) {
    const user = await this.db.user.findUniqueOrThrow({
      where: { id: userId },
    });
    const rawPerms = (user.permissions ?? []) as {
      resource: string;
      action?: string;
      effect: string;
      condition?: Record<string, unknown> | null;
    }[];

    const normalizedResource = resource.toLowerCase();

    // Remove any existing entry that resolves to the same combined resource
    const filtered = rawPerms.filter(
      (perm) => this.normalizePermissionResource(perm) !== normalizedResource,
    );

    // Store in the new combined format (no action field)
    const updatedPermissions = [
      ...filtered,
      { resource: normalizedResource, effect },
    ];

    if (effect === "allow" && normalizedResource === "user.create") {
      await this.db.user.update({
        where: { id: userId },
        data: {
          role: "admin",
        },
      });
    }
    return this.db.user.update({
      where: { id: userId },
      data: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
        permissions: updatedPermissions as any,
      },
    });
  }
  async getEntityFromUser(
    userId: string,
    profile: "student" | "staff" | "contact",
  ): Promise<{
    entityId?: string;
    entityType: "staff" | "contact" | "student";
    lastName?: string | null;
    firstName?: string | null;
  }> {
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

  async createUser({
    input,
    authApi,
    requestHeaders,
    schoolId,
    pubsub,
  }: {
    input: {
      username: string;
      password?: string;
      entityId: string;
      profile: "staff" | "contact" | "student";
      email?: string | null;
    };
    authApi: Auth["api"];
    requestHeaders: Headers;
    schoolId: string;
    pubsub: PubSubLogger;
  }) {
    const entity = await this.getUserFromEntity({
      entityId: input.entityId,
      entityType: input.profile,
    });
    // check if the entity has un userId already
    if (entity.userId) {
      // should never happened, we shoud handle this in frontend with update
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Cet utilisateur possède deja un compte",
      });
    }
    //check for duplicate
    const exitingUser = await this.db.user.findFirst({
      where: {
        username: input.username,
      },
    });
    if (exitingUser) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `${input.username} est déjà utilisé, choisissez un autre nom d'utilisateur`,
      });
    }
    const school = await this.db.school.findUniqueOrThrow({
      where: {
        id: schoolId,
      },
    });
    let orgId = null;
    try {
      const org = await authApi.getFullOrganization({
        query: {
          organizationSlug: school.code,
        },
        headers: requestHeaders,
      });
      orgId = org?.id;
    } catch (err) {
      if (
        err instanceof APIError &&
        err.body?.code === "ORGANIZATION_NOT_FOUND"
      ) {
        const metadata = { schoolId: school.id };

        const newOrg = await authApi.createOrganization({
          body: {
            name: school.name,
            slug: school.code,
            logo: school.logo ?? undefined,
            metadata,
            keepCurrentActiveOrganization: true,
          },
          // This endpoint requires session cookies.
          headers: requestHeaders,
        });
        orgId = newOrg?.id;
        console.log(">>>>>>> Creating an org after an error", newOrg);
      } else {
        throw err;
      }
    }

    if (!orgId) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Impossible de créer l'org ${school.code}`,
      });
    }
    // 1. Create user
    const email =
      (input.email ?? "").trim() || `${input.username}@discolaire.com`;
    const { user: newUser } = await authApi.signUpEmail({
      body: {
        email,
        name: entity.name,
        password: input.password ?? generateRandomString(12),
        username: input.username,
        displayUsername: entity.name,
        schoolId,
        profile: input.profile,
        isActive: true,
      },
      headers: requestHeaders,
    });

    const baseUrl = getBaseUrlFromHeaders(requestHeaders);
    // 2. Send invitation
    await authApi.createInvitation({
      body: {
        email: newUser.email,
        role: "member",
        organizationId: orgId,
        resend: true,
      },
      headers: requestHeaders,
    });

    await this.attachUser({
      entityType: input.profile,
      entityId: input.entityId,
      userId: newUser.id,
    });

    await authApi.requestPasswordReset({
      body: {
        email: newUser.email,
        redirectTo: `${baseUrl}/auth/reset-password`,
      },
      headers: requestHeaders,
    });

    await pubsub.publish("user", {
      type: "create",
      data: {
        id: input.entityId,
        metadata: {
          profile: input.profile,
          entityId: input.entityId,
        },
      },
    });
    return newUser;
  }

  async updateUser({
    input,
    authApi,
    requestHeaders,
    pubsub,
  }: {
    input: {
      id: string;
      username: string;
      password?: string;
      email?: string;
      name?: string;
    };
    authApi: Auth["api"];
    requestHeaders: Headers;
    pubsub: PubSubLogger;
  }) {
    const userExist = await this.db.user.findFirst({
      where: {
        username: input.username,
      },
    });
    if (userExist && userExist.id !== input.id) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: `Le nom utilisateur ${input.username} est déjà pris, choisissez-en un autre.`,
      });
    }
    if (input.password) {
      // due to better-auth migration, i needed to create account for existing user
      const account = await this.db.account.findFirst({
        where: {
          userId: input.id,
          providerId: "credential",
        },
      });
      if (!account) {
        await this.db.account.create({
          data: {
            id: uuidv4(),
            userId: input.id,
            accountId: input.id,
            providerId: "credential",
            password: await hashPassword(input.password),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      }
      const email =
        (input.email ?? "").trim() || `${input.username}@discolaire.com`;
      const baseUrl = getBaseUrlFromHeaders(requestHeaders);
      await authApi.requestPasswordReset({
        body: {
          email: email,
          redirectTo: `${baseUrl}/auth/reset-password`,
        },
        headers: requestHeaders,
      });
      await authApi.setUserPassword({
        body: {
          userId: input.id,
          newPassword: input.password,
        },
        headers: requestHeaders,
      });
    }

    await this.db.user.update({
      where: {
        id: input.id,
      },
      data: {
        username: input.username,
        ...(input.email && { email: input.email }),
        isActive: true,
        ...(input.name && { name: input.name }),
      },
    });
    if (input.email && userExist?.email !== input.email) {
      await authApi.sendVerificationEmail({
        body: {
          email: input.email,
        },
        headers: requestHeaders,
      });
    }
    await pubsub.publish("user", {
      type: "update",
      data: {
        id: input.id,
        metadata: {
          name: input.name,
        },
      },
    });
    return this.db.user.findUniqueOrThrow({
      where: {
        id: input.id,
      },
    });
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

  async getPermissions(userId: string) {
    const user = await this.db.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        permissions: true,
        userRoles: {
          select: {
            role: {
              select: {
                id: true,
                name: true,
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
        sources: [
          {
            type: "direct" as const,
          },
        ],
      };
    });
    const rolePermissions = user.userRoles.flatMap((userRole) =>
      userRole.role.permissionRoles.map((permissionRole) => {
        return {
          effect: permissionRole.effect.toLowerCase() as "allow" | "deny",
          resource: permissionRole.permission.resource,
          condition: permissionRole.condition as
            | Record<string, unknown>
            | null
            | undefined,
          sources: [
            {
              type: "role" as const,
              role: {
                id: userRole.role.id,
                name: userRole.role.name,
              },
            },
          ],
        };
      }),
    );

    return this.mergePermissions([...directPermissions, ...rolePermissions]);
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
  async getUserFromEntity({
    entityId,
    entityType,
  }: {
    entityId: string;
    entityType: "staff" | "student" | "contact";
  }) {
    let ret: {
      name: string;
      id?: string;
      userId?: string | null;
      username?: string;
      email?: string;
      entityType: "staff" | "student" | "contact";
    } | null = null;
    if (entityType == "staff") {
      const dd = await this.db.staff.findUnique({
        where: {
          id: entityId,
        },
        include: {
          user: true,
        },
      });
      ret = {
        name: `${dd?.lastName} ${dd?.firstName}`,
        id: dd?.id,
        userId: dd?.userId,
        email: dd?.user?.email,
        entityType: "staff",
      };
    } else if (entityType == "student") {
      const dd = await this.db.student.findUnique({
        where: {
          id: entityId,
        },
        include: {
          user: true,
        },
      });
      ret = {
        name: `${dd?.lastName} ${dd?.firstName}`,
        id: dd?.id,
        userId: dd?.userId,
        email: dd?.user?.email,
        entityType: "student",
      };
    } else {
      const dd = await this.db.contact.findUnique({
        where: {
          id: entityId,
        },
        include: {
          user: true,
        },
      });
      ret = {
        name: `${dd?.lastName} ${dd?.firstName}`,
        id: dd?.id,
        userId: dd?.userId,
        entityType: "contact",
        email: dd?.user?.email,
      };
    }
    if (ret.userId) {
      const user = await this.db.user.findUniqueOrThrow({
        where: {
          id: ret.userId,
        },
      });
      return {
        ...ret,
        username: user.username,
      };
    }
    return ret;
  }
}
