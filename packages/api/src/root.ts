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
import { communicationChannelRouter } from "./routers/communicationChannel";
import { consigneRouter } from "./routers/consigne";
import { contactRouter } from "./routers/contact";
import { convocationRouter } from "./routers/convocation";
import { courseRouter } from "./routers/course";
import { degreeRouter } from "./routers/degree";
import { directoryRouter } from "./routers/directory";
import { disciplineRouter } from "./routers/discipline";
import { documentRouter } from "./routers/document";
import { emailRouter } from "./routers/email";
import { enrollmentRouter } from "./routers/enrollment";
import { exclusionRouter } from "./routers/exclusion";
import { feeRouter } from "./routers/fee";
import { feedbackRouter } from "./routers/feedback";
import { formerShoolRouter } from "./routers/formerSchool";
import { gradeRouter } from "./routers/grade";
import { gradeAppreciationRouter } from "./routers/gradeAppreciation";
import { gradeSheetRouter } from "./routers/gradeSheet";
import { healthRouter } from "./routers/health";
import { inventoryRouter } from "./routers/inventory";
import { inventoryUsageRouter } from "./routers/inventoryUsage";
import { latenessRouter } from "./routers/lateness";
import { lessonRouter } from "./routers/lesson";
import { libraryRouter } from "./routers/library";
import { logActivityRouter } from "./routers/logActivity";
import { loginActivityRouter } from "./routers/loginActivity";
import { menuRouter } from "./routers/menu";
import { messagingRouter } from "./routers/messaging";
import { notificationPreferenceRouter } from "./routers/notificationPreference";
import { permissionRouter } from "./routers/permission";
import { photoRouter } from "./routers/photo";
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
import { schoolYearEventRouter } from "./routers/schoolYearEvent";
import { settingRouter } from "./routers/setting";
import { shortcutRouter } from "./routers/shortcut";
import { staffRouter } from "./routers/staff";
import { studentRouter } from "./routers/student";
import { studentAccountRouter } from "./routers/studentAccount";
import { studentContactRouter } from "./routers/studentContact";
import { subjectRouter } from "./routers/subject";
import { subjectGroupRouter } from "./routers/subjectGroup";
import { subjectJournalRouter } from "./routers/subjectJournal";
import { subscriptionRouter } from "./routers/subscription";
import { termRouter } from "./routers/term";
import { timetableRouter } from "./routers/timetable";
import { timetableCategoryRouter } from "./routers/timetableCategory";
import { transactionRouter } from "./routers/transaction";
import { uploadRouter } from "./routers/upload";
import { userRouter } from "./routers/user";
import { userNotificationRouter } from "./routers/userNotification";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  staff: staffRouter,
  photo: photoRouter,
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
  userNotification: userNotificationRouter,
  course: courseRouter,
  gradeAppreciation: gradeAppreciationRouter,
  classroomCycle: classroomCycleRouter,
  classroomLevel: classroomLevelRouter,
  classroomSection: classroomSectionRouter,
  user: userRouter,
  bible: bibleRouter,
  subscription: subscriptionRouter,
  convocation: convocationRouter,
  student: studentRouter,
  scheduleTask: scheduleTaskRouter,
  assignment: assignmentRouter,
  term: termRouter,
  document: documentRouter,
  schoolYearEvent: schoolYearEventRouter,
  school: schoolRouter,
  email: emailRouter,
  inventoryUsage: inventoryUsageRouter,
  consigne: consigneRouter,
  loginActivity: loginActivityRouter,
  studentContact: studentContactRouter,
  calendarEvent: calendarEventRouter,
  communicationChannel: communicationChannelRouter,
  notificationPreference: notificationPreferenceRouter,
  studentAccount: studentAccountRouter,
  formerSchool: formerShoolRouter,
  inventory: inventoryRouter,
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
  logActivity: logActivityRouter,
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
  discipline: disciplineRouter,
  timetableCategory: timetableCategoryRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
