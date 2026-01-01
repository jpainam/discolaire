import "dotenv/config";

import fs from "fs";
import path from "node:path";
import dotenv from "dotenv";
import { defineConfig, env } from "prisma/config";

if (fs.existsSync(".env")) {
  dotenv.config({ path: ".env" });
} else {
  dotenv.config({ path: ".env.example" });
}

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
