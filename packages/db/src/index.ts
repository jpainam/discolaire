import { PrismaClient } from "./generated/client/client";

const globalForPrisma = globalThis as unknown as {
  prismaTenants?: Map<string, PrismaClient>;
};

globalForPrisma.prismaTenants ??= new Map();

export interface GetDbParams {
  connectionString: string;
}

export function getDb({ connectionString }: GetDbParams): PrismaClient {
  const cache = globalForPrisma.prismaTenants;
  if (!cache) {
    throw new Error(">>>>> Unable to create globalForPrisma");
  }
  if (cache.has(connectionString)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return cache.get(connectionString)!;
  }
  //const pool = new PrismaPg({ connectionString: `${connectionString}::csac` });

  const prisma = new PrismaClient({
    datasourceUrl: connectionString,
  });
  cache.set(connectionString, prisma);
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
