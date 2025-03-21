import { absenceRouter } from "./routers/absence";
import { accountingRouter } from "./routers/accounting";
import { announcementRouter } from "./routers/announcement";
import { appreciationRouter } from "./routers/appreciation";
import { assignmentRouter } from "./routers/assignment";
import { attendanceRouter } from "./routers/attendance";
import { bibleRouter } from "./routers/bible";
import { bookRouter } from "./routers/book";
import { calendarEventRouter } from "./routers/calendarEvent";
import { chatterRouter } from "./routers/chatter";
import { classroomRouter } from "./routers/classroom";
import { classroomCycleRouter } from "./routers/classroomCycle";
import { classroomLevelRouter } from "./routers/classroomLevel";
import { classroomSectionRouter } from "./routers/classroomSection";
import { consigneRouter } from "./routers/consigne";
import { contactRouter } from "./routers/contact";
import { courseRouter } from "./routers/course";
import { degreeRouter } from "./routers/degree";
import { directoryRouter } from "./routers/directory";
import { documentRouter } from "./routers/document";
import { enrollmentRouter } from "./routers/enrollment";
import { exclusionRouter } from "./routers/exclusion";
import { feeRouter } from "./routers/fee";
import { feedbackRouter } from "./routers/feedback";
import { formerShoolRouter } from "./routers/formerSchool";
import { gradeRouter } from "./routers/grade";
import { gradeAppreciationRouter } from "./routers/gradeAppreciation";
import { gradeSheetRouter } from "./routers/gradeSheet";
import { healthRouter } from "./routers/health";
import { journalRouter } from "./routers/journal";
import { latenessRouter } from "./routers/lateness";
import { lessonRouter } from "./routers/lesson";
import { libraryRouter } from "./routers/library";
import { menuRouter } from "./routers/menu";
import { messagingRouter } from "./routers/messaging";
import { passwordResetRouter } from "./routers/passwordReset";
import { permissionRouter } from "./routers/permission";
import { policyRouter } from "./routers/policy";
import { postRouter } from "./routers/post";
import { programRouter } from "./routers/program";
import { recipientRouter } from "./routers/recipient";
import { religionRouter } from "./routers/religion";
import { reportCardRouter } from "./routers/reportCard";
import { reportingRouter } from "./routers/reporting";
import { roleRouter } from "./routers/role";
import { scheduleJobRouter } from "./routers/scheduleJob";
import { scheduleTaskRouter } from "./routers/scheduleTask";
import { schoolRouter } from "./routers/school";
import { schoolYearRouter } from "./routers/schoolYear";
import { settingRouter } from "./routers/setting";
import { shortcutRouter } from "./routers/shortcut";
import { staffRouter } from "./routers/staff";
import { studentRouter } from "./routers/student";
import { studentAccountRouter } from "./routers/studentAccount";
import { studentContactRouter } from "./routers/studentContact";
import { subjectRouter } from "./routers/subject";
import { subjectGroupRouter } from "./routers/subjectGroup";
import { subjectJournalRouter } from "./routers/subjectJournal";
import { termRouter } from "./routers/term";
import { timetableRouter } from "./routers/timetable";
import { transactionRouter } from "./routers/transaction";
import { uploadRouter } from "./routers/upload";
import { userRouter } from "./routers/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  staff: staffRouter,
  upload: uploadRouter,
  classroom: classroomRouter,
  contact: contactRouter,
  subject: subjectRouter,
  timetable: timetableRouter,
  scheduleJob: scheduleJobRouter,
  directory: directoryRouter,
  library: libraryRouter,
  subjectGroup: subjectGroupRouter,
  fee: feeRouter,
  book: bookRouter,
  degree: degreeRouter,
  course: courseRouter,
  gradeAppreciation: gradeAppreciationRouter,
  classroomCycle: classroomCycleRouter,
  classroomLevel: classroomLevelRouter,
  classroomSection: classroomSectionRouter,
  journal: journalRouter,
  user: userRouter,
  bible: bibleRouter,
  student: studentRouter,
  scheduleTask: scheduleTaskRouter,
  assignment: assignmentRouter,
  term: termRouter,
  document: documentRouter,
  school: schoolRouter,
  consigne: consigneRouter,
  passwordReset: passwordResetRouter,
  studentContact: studentContactRouter,
  calendarEvent: calendarEventRouter,
  studentAccount: studentAccountRouter,
  formerSchool: formerShoolRouter,
  setting: settingRouter,
  grade: gradeRouter,
  religion: religionRouter,
  permission: permissionRouter,
  feedback: feedbackRouter,
  gradeSheet: gradeSheetRouter,
  health: healthRouter,
  role: roleRouter,
  shortcut: shortcutRouter,
  exclusion: exclusionRouter,
  enrollment: enrollmentRouter,
  appreciation: appreciationRouter,
  reportCard: reportCardRouter,
  accounting: accountingRouter,
  announcement: announcementRouter,
  recipient: recipientRouter,
  schoolYear: schoolYearRouter,
  program: programRouter,
  menu: menuRouter,
  policy: policyRouter,
  post: postRouter,
  attendance: attendanceRouter,
  messaging: messagingRouter,
  transaction: transactionRouter,
  reporting: reportingRouter,
  subjectJournal: subjectJournalRouter,
  lesson: lessonRouter,
  lateness: latenessRouter,
  absence: absenceRouter,
  chatter: chatterRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
