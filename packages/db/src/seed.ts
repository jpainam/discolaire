//import type { Prisma } from "@prisma/client";
//import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

// // npx prisma db seed --preview-feature
// async function updateStudents() {
//   const limit = 1000;
//   const offset = 1500;
//   const students = await client.student.findMany({
//     orderBy: {
//       id: "asc",
//     },
//     take: limit,
//     skip: offset,
//   });
//   const data = await Promise.all(
//     students.map(async (student) => {
//       const firstName = faker.person.firstName(
//         (student.gender ?? "male") as "female" | "male",
//       );
//       const lastName = faker.person.lastName(
//         (student.gender ?? "male") as "female" | "male",
//       );
//       const email = faker.internet.email({
//         firstName: firstName.slice(0, 3),
//         lastName: lastName.slice(0, 3),
//       });
//       const std = {
//         ...student,
//         firstName: firstName,
//         tags: student.tags ?? {},
//         lastName: lastName,
//         email: email.toLowerCase(),
//       } as Prisma.StudentUpdateInput;
//       await client.student.update({
//         where: { id: student.id },
//         data: { ...std },
//       });
//       await new Promise((resolve) => {
//         setTimeout(() => {
//           resolve(true);
//         }, 100);
//       });
//       return std;
//     }),
//   );
//   //   await client.student.updateMany({
//   //     where: {},
//   //     data: data,
//   //  });
//   //   const student = students[0];
//   //   if (!student) {
//   //     return;
//   //   }
//   //   const firstName = faker.person.firstName(
//   //     (student.gender ?? "male") as "female" | "male",
//   //   );
//   //   const lastName = faker.person.lastName(
//   //     (student.gender ?? "male") as "female" | "male",
//   //   );
//   //   const email = faker.internet.email({ firstName, lastName });

//   //   await client.student.update({
//   //     where: { id: student.id },
//   //     data: {
//   //       ...student,
//   //       tags: student.tags ?? {},
//   //       firstName: firstName,
//   //       lastName: lastName,
//   //       email: email,
//   //     },
//   //   });
//   //   console.log(
//   //     `Updated student ${student.id} ${student.firstName} ${student.lastName} ${student.email}`,
//   //   );
// }
async function main() {
  console.log("Seeding database...");
  //await updateStudents();
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
