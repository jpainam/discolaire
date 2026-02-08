import type { PrismaClient } from "@repo/db";

import { AcademicSnapshotService } from "./academic-snapshot-service";
import { AccountingService } from "./accounting-service";
import { AnnualService } from "./annual-service";
import { AttendanceService } from "./attendance-service";
import { ClassroomService } from "./classroom-service";
import { ContactService } from "./contact-service";
import { EnrollmentService } from "./enrollment-service";
import { FeeService } from "./fee-service";
import { GradeSheetService } from "./gradesheet-service";
import { InventoryService } from "./inventory-service";
import { LogActivityService } from "./log-activity-service";
import { NotificationService } from "./notification-service";
import { ReportCardService } from "./reportcard-service";
import { SchoolService } from "./school-service";
import { SchoolYearService } from "./school-year-service";
import { SequenceService } from "./sequence-service";
import { StaffService } from "./staff-service";
import { StudentService } from "./student-service";
import { TransactionService } from "./transaction-service";
import { TrimestreService } from "./trimestre-service";
import { UserService } from "./user-service";

export { messagingService } from "./messaging-service";

export interface ServiceDeps {
  db: PrismaClient;
}

type ServiceCtor<T> = new (deps: ServiceDeps["db"]) => T;

const serviceRegistry = {
  student: StudentService,
  transaction: TransactionService,
  classroom: ClassroomService,
  attendance: AttendanceService,
  enrollment: EnrollmentService,
  accounting: AccountingService,
  annual: AnnualService,
  contact: ContactService,
  fee: FeeService,
  gradesheet: GradeSheetService,
  inventory: InventoryService,
  reportcard: ReportCardService,
  sequence: SequenceService,
  trimestre: TrimestreService,
  school: SchoolService,
  schoolyear: SchoolYearService,
  staff: StaffService,
  user: UserService,
  notification: NotificationService,
  academicSnapshot: AcademicSnapshotService,
  logActivity: LogActivityService,
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
