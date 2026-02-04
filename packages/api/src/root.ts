import { accountingJournal } from "./routers/accountingJournal";
import { announcementRouter } from "./routers/announcement";
import { appreciationRouter } from "./routers/appreciation";
import { assignmentRouter } from "./routers/assignment";
import { attendanceRouter } from "./routers/attendance";
import { bibleRouter } from "./routers/bible";
import { bookRouter } from "./routers/book";
import { calendarEventRouter } from "./routers/calendarEvent";
import { classroomRouter } from "./routers/classroom";
import { classroomCycleRouter } from "./routers/classroomCycle";
import { classroomLevelRouter } from "./routers/classroomLevel";
import { classroomSectionRouter } from "./routers/classroomSection";
import { communicationChannelRouter } from "./routers/communicationChannel";
import { contactRouter } from "./routers/contact";
import { contactRelationshipRouter } from "./routers/contactRelationship";
import { convocationRouter } from "./routers/convocation";
import { courseRouter } from "./routers/course";
import { degreeRouter } from "./routers/degree";
import { directoryRouter } from "./routers/directory";
import { disciplineRouter } from "./routers/discipline";
import { documentRouter } from "./routers/document";
import { emailRouter } from "./routers/email";
import { enrollmentRouter } from "./routers/enrollment";
import { feeRouter } from "./routers/fee";
import { feedbackRouter } from "./routers/feedback";
import { formerShoolRouter } from "./routers/formerSchool";
import { fundRouter } from "./routers/fund";
import { gradeRouter } from "./routers/grade";
import { gradeAppreciationRouter } from "./routers/gradeAppreciation";
import { gradeSheetRouter } from "./routers/gradeSheet";
import { healthRouter } from "./routers/health";
import { importStudentRouter } from "./routers/importStudent";
import { inventoryRouter } from "./routers/inventory";
import { inventoryUsageRouter } from "./routers/inventoryUsage";
import { libraryRouter } from "./routers/library";
import { logActivityRouter } from "./routers/logActivity";
import { menuRouter } from "./routers/menu";
import { messagingRouter } from "./routers/messaging";
import { moduleRouter } from "./routers/module";
import { notificationRouter } from "./routers/notification";
import { notificationPreferenceRouter } from "./routers/notificationPreference";
import { notificationRecipientRouter } from "./routers/notificationRecipient";
import { notificationSubscriptionRouter } from "./routers/notificationSubscription";
import { notificationTemplateRouter } from "./routers/notificationTemplate";
import { permissionRouter } from "./routers/permission";
import { photoRouter } from "./routers/photo";
import { recipientRouter } from "./routers/recipient";
import { religionRouter } from "./routers/religion";
import { reportCardRouter } from "./routers/reportCard";
import { roleRouter } from "./routers/role";
import { scheduleDivisionRouter } from "./routers/scheduleDivision";
import { scheduleTaskRouter } from "./routers/scheduleTask";
import { schoolRouter } from "./routers/school";
import { schoolYearRouter } from "./routers/schoolYear";
import { schoolYearEventRouter } from "./routers/schoolYearEvent";
import { settingRouter } from "./routers/setting";
import { shortcutRouter } from "./routers/shortcut";
import { skillAcquisitionRouter } from "./routers/skillAcquisition";
import { staffRouter } from "./routers/staff";
import { staffAttendanceRouter } from "./routers/staffAttendance";
import { studentRouter } from "./routers/student";
import { studentContactRouter } from "./routers/studentContact";
import { subjectRouter } from "./routers/subject";
import { subjectGroupRouter } from "./routers/subjectGroup";
import { subjectJournalRouter } from "./routers/subjectJournal";
import { subjectProgramRouter } from "./routers/subjectProgram";
import { subjectTimetableRouter } from "./routers/subjectTimetable";
import { termRouter } from "./routers/term";
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
  accountingJournal: accountingJournal,
  notificationSubscription: notificationSubscriptionRouter,
  convocation: convocationRouter,
  student: studentRouter,
  permission: permissionRouter,
  scheduleTask: scheduleTaskRouter,
  assignment: assignmentRouter,
  staffAttendance: staffAttendanceRouter,
  term: termRouter,
  module: moduleRouter,
  document: documentRouter,
  schoolYearEvent: schoolYearEventRouter,
  school: schoolRouter,
  email: emailRouter,
  role: roleRouter,
  inventoryUsage: inventoryUsageRouter,
  studentContact: studentContactRouter,
  calendarEvent: calendarEventRouter,
  communicationChannel: communicationChannelRouter,
  notificationPreference: notificationPreferenceRouter,
  notificationRecipient: notificationRecipientRouter,
  formerSchool: formerShoolRouter,
  contactRelationship: contactRelationshipRouter,
  inventory: inventoryRouter,
  scheduleDivision: scheduleDivisionRouter,
  setting: settingRouter,
  grade: gradeRouter,
  religion: religionRouter,
  feedback: feedbackRouter,
  gradeSheet: gradeSheetRouter,
  health: healthRouter,
  shortcut: shortcutRouter,
  enrollment: enrollmentRouter,
  reportCard: reportCardRouter,
  announcement: announcementRouter,
  logActivity: logActivityRouter,
  recipient: recipientRouter,
  schoolYear: schoolYearRouter,
  menu: menuRouter,
  attendance: attendanceRouter,
  messaging: messagingRouter,
  fund: fundRouter,
  transaction: transactionRouter,
  subjectJournal: subjectJournalRouter,
  subjectTimetable: subjectTimetableRouter,
  importStudent: importStudentRouter,
  discipline: disciplineRouter,
  subjectProgram: subjectProgramRouter,
  appreciation: appreciationRouter,
  skillAcquisition: skillAcquisitionRouter,
  notification: notificationRouter,
  notificationTemplate: notificationTemplateRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
