import "dotenv/config";

import path from "node:path";
import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

config();

export default defineConfig({
  schema: path.join("prisma", "schema"),
  migrations: {
    path: "./prisma/migrations",
    seed: "tsx ./src/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
