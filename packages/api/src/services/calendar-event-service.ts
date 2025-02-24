// type SchoolYearData = {};

// type TeachingData = {
//   classroomId: string;
//   subjectId: string;
// };

// type CalendarEventData = SchoolYearData | TeachingData;

// export function parseCalendarEventData(event: any): CalendarEventData {
//   switch (event.calendarType.id) {
//     case 1:
//       return event.data as SchoolYearData;
//     case 2:
//       return event.data as TeachingData;
//     default:
//       throw new Error(`Unknown calendar type: ${event.calendarType.name}`);
//   }
// }
