// export { db } from "./client";
// export * from "@prisma/client";

import { PrismaClient } from "@prisma/client";

//import { PrismaClient } from "../generated/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
export * from "@prisma/client";
// export {
//   DocumentKind,
//   StudentStatus,
//   TransactionStatus,
//   TransactionType,
//   VisibilityType,
// } from "../generated/client";
// export type {
//   AiChat,
//   AiDocument,
//   AiSuggestion,
//   Contact,
//   Policy,
//   Prisma,
//   PrismaClient,
//   School,
//   SchoolYear,
//   Staff,
//   Student,
//   User,
//   Vote,
// } from "../generated/client";
