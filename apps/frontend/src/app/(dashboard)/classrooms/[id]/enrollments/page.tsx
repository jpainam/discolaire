import { Suspense } from "react";
import { EnrollmentDataTable } from "~/components/classrooms/enrollments/EnrollmentDataTable";
import { HydrateClient, prefetch, trpc } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  // const canReadClassroom = await checkPermission(
  //   "enrollment",
  //   PermissionAction.READ,
  // );
  // if (!canReadClassroom) {
  //   return <NoPermission className="my-8" isFullPage={true} resourceText="" />;
  // }
  //const students = await api.classroom.students(params.id);
  void prefetch(trpc.classroom.students.queryOptions(params.id));
  return (
    <div className="flex flex-col p-4">
      <HydrateClient>
        <Suspense
          fallback={
            <div className="flex h-full w-full items-center justify-center">
              Loading...
            </div>
          }
        >
          <EnrollmentDataTable classroomId={params.id} />
        </Suspense>
      </HydrateClient>
    </div>
  );
}
