export default async function Page(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string; date?: Date }>;
}) {
  const searchParams = await props.searchParams;

  const { type, date } = searchParams;

  const params = await props.params;

  const { id } = params;

  return (
    <div className="mb-2 flex flex-1 flex-col">
      {id} - {type} - {JSON.stringify(date)}
    </div>
  );
}
