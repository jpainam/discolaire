import { CreateEditProgram } from "~/components/classrooms/programs/CreateEditProgram";

export default async function Page(props: {
  params: Promise<{ subjectId: string }>;
}) {
  const params = await props.params;

  const { subjectId } = params;

  return (
    <div className="flex flex-col">
      {/* <ProgramHeader />
      <Separator /> */}
      <CreateEditProgram subjectId={Number(subjectId)} />
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
