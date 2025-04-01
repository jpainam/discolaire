import { ClassroomFeeHeader } from "~/components/classrooms/fees/ClassroomFeeHeader";
import { ClassroomFeeTable } from "~/components/classrooms/fees/ClassroomFeeTable";
import { HydrateClient, prefetch, trpc } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const { id } = params;

  // const canReadClassroomFee = await checkPermission(
  //   "fee",
  //   PermissionAction.READ,
  // );
  // if (!canReadClassroomFee) {
  //   return <NoPermission className="my-8" isFullPage={true} resourceText="" />;
  // }
  void prefetch(trpc.classroom.fees.queryOptions(id));
  return (
    <div className="flex w-full flex-col gap-2">
      <ClassroomFeeHeader />
      <HydrateClient>
        <ClassroomFeeTable classroomId={id} />
      </HydrateClient>
    </div>
  );
}
