import path from "node:path";
import type { PrismaConfig } from "prisma";

export default {
  schema: path.join("./prisma/", "schema.prisma"),
  migrations: {
    path: path.join("./", "migrations"),
  },
  views: {
    path: path.join("./", "views"),
  },
  typedSql: {
    path: path.join("./", "queries"),
  },
} satisfies PrismaConfig;
