import { caller } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const programs = await caller.program.byClassroom({
    classroomId: params.id,
  });
  return (
    <div>
      {programs.map((program) => {
        return (
          <div key={program.id}>
            <h3>{program.category.title}</h3>
            <p>{program.title}</p>
          </div>
        );
      })}
      Liste le resume des programe pour cette class, avc l click sur un subject
      qui ouvre les details
    </div>
  );
}
