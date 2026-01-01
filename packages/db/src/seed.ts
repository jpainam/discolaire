//import { faker } from "@faker-js/faker";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "./generated/client/client";

// import appreciations from "./shared/appreciation.ts"; workaround for ts-node issue with import
const databaseUrl = process.env.DATABASE_URL;
if (!process.env.DATABASE_URL) {
  throw new Error("Missing POSTGRES_URL");
}
const adapter = new PrismaPg({ connectionString: databaseUrl });

const client = new PrismaClient({ adapter });

// // npx prisma db seed --preview-feature
//
async function main() {
  console.log("Seeding database...");

  return new Promise((resolve, _reject) => {
    resolve(true);
  });
}

main()
  .catch((e) => {
    console.error(e);
    throw e;
  })

  .finally(async () => {
    await client.$disconnect();
  });
