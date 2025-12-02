//import { faker } from "@faker-js/faker";
import { PrismaPg } from "@prisma/adapter-pg";

import { env } from "./env";
import { PrismaClient } from "./generated/client/client";

// import appreciations from "./shared/appreciation.ts"; workaround for ts-node issue with import

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });

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
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .finally(async () => {
    await client.$disconnect();
  });
