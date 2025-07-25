import { CreateEditProgram } from "~/components/classrooms/programs/CreateEditProgram";
import { caller } from "~/trpc/server";

export default async function Page(props: {
  params: Promise<{ subjectId: string }>;
}) {
  const params = await props.params;

  const { subjectId } = params;
  const subject = await caller.subject.get(Number(subjectId));

  return (
    <div className="flex flex-col">
      {/* <ProgramHeader />
      <Separator /> */}
      <CreateEditProgram subject={subject} />
      {/* {subject.program ? (
        <div
          className="p-4"
          dangerouslySetInnerHTML={{
            __html: subject.program,
          }}
        />
      ) : (
        <EmptyState title="No Program" className="my-8" />
      )} */}
    </div>
  );
}
