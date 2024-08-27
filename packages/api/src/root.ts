import { announcementRouter } from "./routers/announcement";
import { appreciationRouter } from "./routers/appreciation";
import { assignmentRouter } from "./routers/assignment";
import { authRouter } from "./routers/auth";
import { calendarEventRouter } from "./routers/calendarEvent";
import { classroomRouter } from "./routers/classroom";
import { classroomCycleRouter } from "./routers/classroomCycle";
import { classroomLevelRouter } from "./routers/classroomLevel";
import { classroomSectionRouter } from "./routers/classroomSection";
import { contactRouter } from "./routers/contact";
import { courseRouter } from "./routers/course";
import { enrollmentRouter } from "./routers/enrollment";
import { feeRouter } from "./routers/fee";
import { gradeRouter } from "./routers/grade";
import { gradeSheetRouter } from "./routers/gradeSheet";
import { healthRouter } from "./routers/health";
import { journalRouter } from "./routers/journal";
import { menuRouter } from "./routers/menu";
import { policyRouter } from "./routers/policy";
import { postRouter } from "./routers/post";
import { programRouter } from "./routers/program";
import { recipientRouter } from "./routers/recipient";
import { reportCardRouter } from "./routers/reportCard";
import { schoolRouter } from "./routers/school";
import { schoolYearRouter } from "./routers/schoolYear";
import { staffRouter } from "./routers/staff";
import { studentRouter } from "./routers/student";
import { studentAccountRouter } from "./routers/studentAccount";
import { studentContactRouter } from "./routers/studentContact";
import { subjectRouter } from "./routers/subject";
import { subjectGroupRouter } from "./routers/subjectGroup";
import { termRouter } from "./routers/term";
import { transactionRouter } from "./routers/transaction";
import { uploadRouter } from "./routers/upload";
import { userRouter } from "./routers/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  staff: staffRouter,
  upload: uploadRouter,
  classroom: classroomRouter,
  contact: contactRouter,
  subject: subjectRouter,
  subjectGroup: subjectGroupRouter,
  fee: feeRouter,
  course: courseRouter,
  classroomCycle: classroomCycleRouter,
  classroomLevel: classroomLevelRouter,
  classroomSection: classroomSectionRouter,
  journal: journalRouter,
  user: userRouter,
  student: studentRouter,
  assignment: assignmentRouter,
  term: termRouter,
  studentContact: studentContactRouter,
  calendarEvent: calendarEventRouter,
  studentAccount: studentAccountRouter,
  school: schoolRouter,
  grade: gradeRouter,
  gradeSheet: gradeSheetRouter,
  health: healthRouter,
  enrollment: enrollmentRouter,
  appreciation: appreciationRouter,
  reportCard: reportCardRouter,
  announcement: announcementRouter,
  recipient: recipientRouter,
  schoolYear: schoolYearRouter,
  program: programRouter,
  menu: menuRouter,
  policy: policyRouter,
  post: postRouter,
  transaction: transactionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
