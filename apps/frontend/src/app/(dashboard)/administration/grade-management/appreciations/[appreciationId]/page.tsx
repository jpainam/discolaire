export default async function Page(props: {
  params: Promise<{ id: string; appreciationId: string }>;
}) {
  const params = await props.params;

  const { id, appreciationId } = params;

  return (
    <div>
      {id} - {appreciationId}
    </div>
  );
}
