import { ClassroomDetails } from "~/components/classrooms/ClassroomDetails";
import { EnrollmentDataTable } from "~/components/classrooms/enrollments/EnrollmentDataTable";
import { EnrollmentHeader } from "~/components/classrooms/enrollments/EnrollmentHeader";
import { api } from "~/trpc/server";
//import TopTimetable from "~/components/classrooms/TopTimetable";
//import { api } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  // const timetables = await api.lesson.byClassroom({
  //   classroomId: params.id,
  //   currentDate: new Date(),
  // });

  // const canReadEnrollment = await checkPermission(
  //   "enrollment",
  //   PermissionAction.READ,
  // );
  const students = await api.classroom.students(params.id);
  const classroom = await api.classroom.get(params.id);

  return (
    <>
      <ClassroomDetails classroomId={params.id} />
      {/* <div>
          <GenderPie classroom={classroom} />
        </div>
        <div>
          <CreditDebitPie />
        </div> */}
      {/* {timetables.length != 0 && <TopTimetable />} */}

      <EnrollmentHeader students={students} classroom={classroom} />
      {/* <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-2 p-2 ">
        <GenderPie classroom={classroom} />
        <RepeatingPie students={students} />
        <GenderPie classroom={classroom} />
        <GenderPie classroom={classroom} />
      </div> */}

      <div className="py-2 px-4">
        <EnrollmentDataTable students={students} />
      </div>
    </>
  );
}
