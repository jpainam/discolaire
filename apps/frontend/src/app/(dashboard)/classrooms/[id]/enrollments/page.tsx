import { Skeleton } from "@repo/ui/components/skeleton";
import { Suspense } from "react";
import { EnrollmentDataTable } from "~/components/classrooms/enrollments/EnrollmentDataTable";
import { EnrollmentHeader } from "~/components/classrooms/enrollments/EnrollmentHeader";
import { caller, HydrateClient, prefetch, trpc } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  // const canReadClassroom = await checkPermission(
  //   "enrollment",
  //   PermissionAction.READ,
  // );
  // if (!canReadClassroom) {
  //   return <NoPermission className="my-8" isFullPage={true} resourceText="" />;
  // }
  const students = await caller.classroom.students(params.id);
  const classroom = await caller.classroom.get(params.id);
  void prefetch(trpc.classroom.students.queryOptions(params.id));
  return (
    <>
      <EnrollmentHeader students={students} classroom={classroom} />
      <div className="flex flex-col p-4">
        <HydrateClient>
          <Suspense
            fallback={
              <div className="grid grid-cols-4 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full " />
                ))}
              </div>
            }
          >
            <EnrollmentDataTable classroomId={params.id} />
          </Suspense>
        </HydrateClient>
      </div>
    </>
  );
}
