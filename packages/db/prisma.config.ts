import "dotenv/config";

import path from "node:path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: path.join("prisma", "schema"),
  migrations: {
    path: "./prisma/migrations",
    seed: "tsx ./src/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
