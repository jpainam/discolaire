import { getDb } from "@repo/db";

import { env } from "./env";

export const db = getDb({ connectionString: env.DATABASE_URL });
