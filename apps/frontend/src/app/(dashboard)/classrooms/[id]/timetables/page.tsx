//import BigCalendar from "~/components/BigCalendar";
import { ClassroomLesson } from "~/components/classrooms/timetables/ClassroomLesson";
//import { ClassroomTimeTable } from "~/components/classrooms/timetables/ClassroomTimeTable";
import { ClassroomTimeTableHeader } from "~/components/classrooms/timetables/ClassroomTimeTableHeader";
export default function Page() {
  return (
    <div className="flex flex-col gap-2">
      <ClassroomTimeTableHeader />
      {/* <ClassroomTimeTable />
      <BigCalendar /> */}
      <ClassroomLesson />
    </div>
  );
}
