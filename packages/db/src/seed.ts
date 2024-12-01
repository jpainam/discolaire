import { db } from ".";

// npx prisma db seed --preview-feature
function main() {
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
    await db.$disconnect();
  });
