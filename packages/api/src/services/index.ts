import type { PrismaClient } from "@repo/db";

import { AttendanceService } from "./attendance-service";
import { ClassroomService } from "./classroom-service";
import { StudentService } from "./student-service";
import { TransactionService } from "./transaction-service";

export { messagingService } from "./messaging-service";
export { staffService } from "./staff-service";
export { studentService } from "./student-service";

export interface ServiceDeps {
  db: PrismaClient;
}

type ServiceCtor<T> = new (deps: ServiceDeps["db"]) => T;

const serviceRegistry = {
  student: StudentService,
  transaction: TransactionService,
  classroom: ClassroomService,
  attendance: AttendanceService,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} satisfies Record<string, ServiceCtor<any>>;

export type Services = {
  [K in keyof typeof serviceRegistry]: InstanceType<
    (typeof serviceRegistry)[K]
  >;
};

export function createServices(db: PrismaClient): Services {
  const entries = Object.entries(serviceRegistry).map(([name, Ctor]) => {
    const instance = new Ctor(db);
    return [name, instance];
  });

  return Object.fromEntries(entries) as Services;
}
