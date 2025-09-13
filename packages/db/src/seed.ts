//import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

// import appreciations from "./shared/appreciation.ts"; workaround for ts-node issue with import

const client = new PrismaClient();

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
