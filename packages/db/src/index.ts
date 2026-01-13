/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "./generated/client/client";

const globalForPrisma = globalThis as unknown as {
  prismaTenants?: Map<string, PrismaClient>;
};

globalForPrisma.prismaTenants ??= new Map();

export interface GetDbParams {
  connectionString: string;
  tenant: string;
}

function withTenantSchema(connectionString: string, tenant: string): string {
  const schema = tenant.trim().toLowerCase();
  try {
    const url = new URL(connectionString);
    url.searchParams.set("schema", schema);
    return url.toString();
  } catch {
    const separator = connectionString.includes("?") ? "&" : "?";
    return `${connectionString}${separator}schema=${schema}`;
  }
}
//const tenants = ["public", "csac", "demo", "ipbw"];
export function getDb({ connectionString, tenant }: GetDbParams): PrismaClient {
  // if (!tenants.includes(tenant)) {
  //   throw new Error(
  //     `Expecting tenant in ${tenants.toString()} found ${tenant}`,
  //   );
  // }
  const cache = globalForPrisma.prismaTenants;
  if (!cache) {
    throw new Error(">>>>> Unable to create globalForPrisma");
  }
  const tenantConnectionString = withTenantSchema(connectionString, "public");
  if (cache.has(tenantConnectionString)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return cache.get(tenantConnectionString)!;
  }
  const adapter = new PrismaPg(
    { connectionString: connectionString },
    { schema: "public" },
  );

  const prisma = new PrismaClient({ adapter });
  cache.set(tenantConnectionString, prisma);
  return prisma;
}

// This export is needed to avoid the TypeScript error:
// ```
// The inferred type of 'prisma' cannot be named without a reference to '../node_modules/@repo/database/src/generated/prisma/client'.
// This is likely not portable. A type annotation is necessary.ts(2742)
// ```
export type { Prisma, PrismaClient } from "./generated/client/client";
export * from "./generated/client/enums";
export * from "./generated/client/internal/prismaNamespace";
