/*import {
  classes,
  feesDescription,
} from "~/components/administration/fees/data";
import { faker } from "@faker-js/faker";

export type Fee = {
  id: number;
  class: string;
  amount: number;
  status: "in_progress" | "upcoming" | "overdue";
  description: string;
  due_date: string;
};

export async function getSchoolFees() {
  //await new Promise((resolve) => { setTimeout(resolve, 5000) })
  const schoolFees: Fee[] = [];
  for (let i = 0; i < 10; i++) {
    schoolFees.push({
      id: i,
      class: faker.helpers.arrayElement(classes),
      amount: i * 1000,
      status: faker.helpers.arrayElement([
        "in_progress",
        "upcoming",
        "overdue",
      ]),
      description: faker.helpers.arrayElement(feesDescription),
      due_date: `2022-01-0${i}`,
    });
  }
  return schoolFees;
}
*/
